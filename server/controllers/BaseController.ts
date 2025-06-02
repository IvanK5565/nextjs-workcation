/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseContext from "@/server/container/BaseContext";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import {
	AccessDeniedError,
	ApiError,
	NotAllowedError,
	UnauthorizedError,
} from "@/server/exceptions";
import { StatusCodes } from "http-status-codes";
import {
	ActionAdapter,
	Action,
	Middleware,
	AnswerType,
	MethodHandler,
	Handler,
	ActionResult,
	Response,
} from "@/types";
import type { ActionProps } from "@/types";
import { AuthOptions, getServerSession, Session } from "next-auth";
import { onSuccessResponse, onErrorResponse } from "@/server/utils";
import i18 from "@/public/locales/en-US";
import { ROLE } from "@/acl/types";
import { POST } from "./decorators";
import { Logger } from "../logger";
import Guard from "@/acl/Guard";
import { IControllerContainer } from ".";
import { Routes } from "../utils/routes";
import container from "../container/container";
import { IEntityContainer } from "@/client/entities";

class Mutex {
	private mutex = Promise.resolve();

	async runCritical<T>(callback: () => Promise<T> | T): Promise<T> {
		const unlock = await this.lock();
		Logger.info('Start critical section');
		try {
			return await callback();
		} finally {
			unlock();
			Logger.info('End critical section');
		}
	}

	lock(): Promise<() => void> {
		let begin: (unlock: () => void) => void = () => { };
		this.mutex = this.mutex.then(() => new Promise(begin));
		return new Promise(resolve => {
			begin = resolve;
		});
	}
}

type ExtendedRequest = NextApiRequest & {
	guard?: Guard;
	session?: Session | null;
};

export default abstract class BaseController extends BaseContext {
	private static mutex = new Mutex();

	@POST("/api/echo")
	public async echo({ body }: ActionProps) {
		Logger.info(body);
		return body;
	}

	private createAction(handler: string, route: string): ActionAdapter {
		return (req, res) => {
			const fn: Action = (this as any)[handler].bind(this);
			return this.getActionProps(req, res, route)
				.then((props) => fn(props))
				.then((results) => JSON.parse(JSON.stringify(results)))
				.catch((error) => {
					this.di.Logger.error(`Error in action: ${handler}. ${error}`);
					throw error;
				});
		};
	}

	private async prepareRequest(
		req: ExtendedRequest,
		res: NextApiResponse,
	) {

		await BaseController.mutex.runCritical(async () => {
			if (!req.session) {
				req.session = await getServerSession<AuthOptions, Session>(
					req,
					res,
					this.di.authOptions
				);
			}
			if (!req.guard) {
				req.guard = new Guard(
					this.di.roles,
					this.di.rules,
					req.session?.user.role || ROLE.GUEST
				);
			}
		});

		// const unlock = await BaseController.mutex.lock();
		// try {
		// 	if (!req.session) {
		// 		req.session = await getServerSession<AuthOptions, Session>(
		// 			req,
		// 			res,
		// 			this.di.authOptions
		// 		);
		// 	}
		// 	if (!req.guard) {
		// 		req.guard = new Guard(
		// 			this.di.roles,
		// 			this.di.rules,
		// 			req.session?.user.role || ROLE.GUEST
		// 		);
		// 	}
		// } catch (error) {
		// 	this.di.Logger.error("Error in prepareRequest:", error);
		// 	throw error;
		// } finally {
		// 	unlock();
		// }
	}

	private async getActionProps(
		req: ExtendedRequest,
		res: NextApiResponse,
		route: string
	): Promise<ActionProps> {
		await BaseController.mutex.runCritical(async () => {
			if (!req.session) {
				Logger.log('get session in getActionProps for route:', route, 'in controller:', this.constructor.name);
				req.session = await getServerSession<AuthOptions, Session>(
					req,
					res,
					this.di.authOptions
				);
			} else {
				Logger.log('session already exists in getActionProps for route:', route, 'in controller:', this.constructor.name);
			}
			if (!req.guard) {
				Logger.log('create Guard in getActionProps for route:', route, 'in controller:', this.constructor.name);
				req.guard = new Guard(
					this.di.roles,
					this.di.rules,
					req.session?.user.role || ROLE.GUEST
				);
			} else {
				Logger.log('Guard already exists in getActionProps for route:', route, 'in controller:', this.constructor.name);
			}
		})
		if(!req.session) throw new UnauthorizedError();
		// this.di.Logger.log("getActionProps method:", req.method, 'session:', session);
		// const guard = this.di.buildGuard(route, session?.user.role);
		if (!req.guard) throw new AccessDeniedError();
		req.guard.resource = route;
		return {
			query: req.query,
			body: req.body,
			session: req.session,
			guard: req.guard,
		};
	}

	public static getInvokeOutput(req: NextApiRequest) {
		const error = new ApiError(
			i18.UnknownRouteErrorMessage,
			StatusCodes.INTERNAL_SERVER_ERROR,
			AnswerType.Log
		);
		const symbols = Object.getOwnPropertySymbols(req);
		const metaSymbol = symbols.find(
			(sym) => sym.toString() === "Symbol(NextInternalRequestMeta)"
		);
		if (!metaSymbol) throw error;

		const meta = (req as any)[metaSymbol];
		if (!meta?.invokeOutput) throw error;
		return meta.invokeOutput;
	}

	private createRouter(route: string) {
		const router = createRouter<NextApiRequest, NextApiResponse>();

		const globalUses: Middleware[] = (
			Reflect.getMetadata("middlewares", this, "") ?? []
		).reverse();
		router.use("/", ...globalUses);

		const endpoints: MethodHandler[] = Reflect.getMetadata(route, this) ?? [];
		endpoints.forEach((e) => {
			const middlewares = (
				Reflect.getMetadata("middlewares", this, e.handler) ?? []
			).reverse();
			(router as any)[e.method](
				...middlewares,
				this.createAction(e.handler, route)
			);
		});

		router.all(() => {
			throw new NotAllowedError();
		});
		return router;
	}

	public handler(_route?: string): Handler {
		return async (req, res) => {
			const route = _route ?? BaseController.getInvokeOutput(req);
			const ssr = !route.startsWith("/api/");
			const router = this.createRouter(route);
			const data = router.run(req, res).then((d) => d as ActionResult);

			if (ssr) return data;

			let response: Response;
			try {
				response = onSuccessResponse(await data);
			} catch (e) {
				this.di.Logger.error("API:", e);
				response = onErrorResponse(e as Error);
			}

			return res.status(response.code).json(response);
		};
	}

	public static getRoutes() {
		const routes: [string, keyof IControllerContainer][] = Reflect.getMetadata('routes', BaseController) ?? [];
		return routes;
	}
	public static handler(): Handler {
		const routesAndControlles = this.getRoutes()
		const routes = Routes.fromStrings(...routesAndControlles.map(rc => rc[0]))
		const findedRoute = routes.findRoute('')?.toString() ?? null;
		if (findedRoute) {
			const controller = routesAndControlles.find(rc => rc[0] === findedRoute)?.[1];
			if (controller)
				return container.resolve(controller).handler();
		}
		return async (req, res) => {
			res.status(404).json('Not Found');
		}
	}

	public getEntityName(): (keyof IEntityContainer) | null {
		const entity = Reflect.getMetadata("entity", this);
		if(!entity) return null;
		return entity as keyof IEntityContainer;
	}
}
