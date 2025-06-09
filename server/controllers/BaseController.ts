/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseContext from "@/server/container/BaseContext";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import {
	AccessDeniedError,
	ApiError,
	NotAllowedError,
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
import { IEntityContainer } from "@/client/entities";

export type ExtendedRequest = NextApiRequest & {
	guard?: Guard;
	session?: Session | null;
};

export default abstract class BaseController extends BaseContext {
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

	private async getActionProps(
		req: ExtendedRequest,
		res: NextApiResponse,
		route: string
	): Promise<ActionProps> {
		await this.di.mutex.runCritical('getActionProps',async () => {
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
		if (!req.guard) throw new AccessDeniedError();
		req.guard.resource = route;
		return {
			query: req.query,
			body: req.body,
			session: req.session??null,
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
		return meta.invokeOutput as string;
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

	public handler(route?: string): Handler {
		return async (req, res) => {
			if(req.body && typeof req.body === 'string') req.body = JSON.parse(req.body);			
			route = route ?? BaseController.getInvokeOutput(req);
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

	public getEntityName(): (keyof IEntityContainer) | null {
		const entity = Reflect.getMetadata("entity", this);
		if(!entity) return null;
		return entity as keyof IEntityContainer;
	}
}
