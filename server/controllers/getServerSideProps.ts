import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import IContextContainer from "@/server/context/IContextContainer";
import { IControllerContainer } from ".";
import { ActionResult, Handler } from "@/types";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../exceptions";
import { onErrorResponse, onSuccessResponse } from "../utils";

type GSSPFactory = <K extends keyof IControllerContainer>(
	controllersNames: K[],
	route?: string
) => GetServerSideProps;

export default function getServerSidePropsContainer(
	ctx: IContextContainer
): GSSPFactory {
	return (controllersNames, route?) => async (context) => {
		const req: NextApiRequest = Object.assign(context.req, {
			query: context.query,
			body: {},
			env: {},
		});
		let props = {};
		ctx.Logger.log("GSSP enter", context.resolvedUrl);
		const promises = controllersNames.map((name) => {
			let ctrl = ctx[name];
			let handler: Handler = ctrl.handler(route);
			return handler(req, context.res as NextApiResponse);
		});
		let results: (ActionResult | void)[] = [];
		try {
			results = await Promise.all(promises);
		} catch (error) {
			ctx.Logger.error("GSSP ERROR: ", error);

			if (error instanceof ApiError) {
				if (error.code === StatusCodes.UNAUTHORIZED) {
					return { redirect: { destination: "/signIn", permanent: true } };
				}
			}
			const r = onErrorResponse(error as Error)
			
			return {
				props: r,
			};
		}

		for (let i = 0; i < results.length; i++) {
			let r = results[i];
			if (r) {
				props = { ...props, ...r };
			} else {
				ctx.Logger.error(
					"The handler did not respond. Maybe you need an API request instead?"
				);
			}
		}
		props = onSuccessResponse(props);
		return {
			props,
		};
	};
}
