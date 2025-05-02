import BaseContext from "@/server/BaseContext";
import { createRouter } from "next-connect";
import { NextApiRequest,NextApiResponse } from "next";
import { ActionError, ApiError, NotAllowedError } from "@/server/exceptions";
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
	ActionProps,
} from "@/types";
import { getServerSession } from "next-auth";
import { onSuccessResponse, onErrorResponse } from "@/server/utils";

export default abstract class BaseController extends BaseContext {
	private createAction(handler: string): ActionAdapter {
		return (req, res) => {
			const fn: Action = (this as any)[handler].bind(this);
			return this.getActionProps(req, res)
				.then((props) => fn(props))
				.then((results) => JSON.parse(JSON.stringify(results)))
				.catch((error) => {
					console.error(`Error in action: ${handler}. ${error}`);
					throw error;
				});
		};
	}

	private async getActionProps(req: NextApiRequest, res: NextApiResponse): Promise<ActionProps> {
		return {
			query: req.query,
			body: req.body,
			session: await getServerSession(req, res, this.di.authOptions),
		};
	}

	private getInvokeOutput(req: NextApiRequest) {
		const symbols = Object.getOwnPropertySymbols(req);
		const metaSymbol = symbols.find(
			(sym) => sym.toString() === "Symbol(NextInternalRequestMeta)"
		);
		if (!metaSymbol) return null;

		const meta = (req as any)[metaSymbol];
		if (!meta?.invokeOutput)
			throw new ApiError(
				"Path is UNKNOWN",
				StatusCodes.INTERNAL_SERVER_ERROR,
				AnswerType.Log
			);
		return meta.invokeOutput;
	}

	private createRouter(path: string) {
		const router = createRouter<NextApiRequest, NextApiResponse>();

		const globalUses: Middleware[] = (
			Reflect.getMetadata("middlewares", this, "") ?? []
		).reverse();
		router.use("/", ...globalUses);

		const endpoints: MethodHandler[] = Reflect.getMetadata(path, this) ?? [];
		endpoints.forEach((e) => {
			const middlewares = (
				Reflect.getMetadata("middlewares", this, e.handler) ?? []
			).reverse();
			(router as any)[e.method](...middlewares, this.createAction(e.handler));
		});

		router.all((_req, _res) => {
			throw new NotAllowedError();
		});
		return router;
	}

	public handler(): Handler;
	public handler(_path: string): Handler;
	public handler(_path?: string): Handler {
		return async (req, res) => {
			const path = _path ?? this.getInvokeOutput(req);
			const ssr = !path.startsWith("/api/");
			console.log('handler')
			let response: Response;
			try {
				const router = this.createRouter(path);
				const data = (await router.run(req, res)) as ActionResult;
				response = onSuccessResponse(data);
			} catch (e) {
				console.log("API ERROR: ", e);
				response = onErrorResponse(e as Error);
			}

			console.log("response ", response);
			return ssr ? response : res.status(response.code).json(response);
		};
	}
}
