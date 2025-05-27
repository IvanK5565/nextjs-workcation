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
import { Routes } from "../utils/routes";
import container from "../container/container";

export default abstract class BaseController extends BaseContext {
	@POST("/api/echo")
	public async echo({body}: ActionProps) {
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
		req: NextApiRequest,
		res: NextApiResponse,
		route: string
	): Promise<ActionProps> {
		const session = await getServerSession<AuthOptions, Session>(
			req,
			res,
			this.di.authOptions
		);
		this.di.Logger.log("getActionProps method:", req.method, 'session:', session);
		// const guard = this.di.buildGuard(route, session?.user.role);
		const {roles,rules} = this.di;
		const guard = new Guard(roles, rules, session?.user.role || ROLE.GUEST);
		guard.resource = route;
		if (!guard) throw new AccessDeniedError();
		return {
			query: req.query,
			body: req.body,
			session,
			guard: guard,
		};
	}

	private getInvokeOutput(req: NextApiRequest) {
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
			const route = _route ?? this.getInvokeOutput(req);
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

	public static getRoutes(){
		const routes:[string, keyof IControllerContainer][] = Reflect.getMetadata('routes', BaseController) ?? [];
		return routes;
	}
	public static handler():Handler{
		const routesAndControlles = this.getRoutes()
		const routes = Routes.fromStrings(...routesAndControlles.map(rc => rc[0]))
		const findedRoute = routes.findRoute('')?.toString() ?? null;
		if(findedRoute){
			const controller = routesAndControlles.find(rc => rc[0]===findedRoute)?.[1];
			if(controller)
				return container.resolve(controller).handler();
		}
		return async (req, res) => {
			res.status(404).json('Not Found');
		}
	}
}
