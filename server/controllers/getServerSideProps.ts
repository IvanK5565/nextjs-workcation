import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import IContextContainer from "@/server/IContextContainer";
import { IControllerContainer } from ".";
import { AnswerType, Handler, Response } from "@/types";
import { StatusCodes } from "http-status-codes";

type GSSPFactory = <K extends keyof IControllerContainer>(
	controllersNames: K[],
	route?: string
) => GetServerSideProps;

export default function getServerSidePropsContainer(
	ctx: IContextContainer
): GSSPFactory {
	return (controllersNames, route?) =>
		(async (context) => {
			const req: NextApiRequest = Object.assign(context.req, {
				query: context.query,
				body: {},
				env: {},
			});
			let props = {};
			console.log("GSSP enter", context.resolvedUrl)
			const promises = controllersNames.map((name) => {
				let ctrl = ctx[name];
				let handler: Handler = ctrl.handler();
				return handler(req, context.res as NextApiResponse);
			});
			let results: (Response | void)[] = [];
			try {
				results = await Promise.all(promises);
			} catch (error) {
				console.error("GSSP ERROR: ", error);
				return {
					props: {
						error: (error as Error).message,
					},
				};
			}

			results = results.filter((v) => {
				if (!v)
					console.error(
						"The handler did not respond. Maybe you need an API request instead?"
					);
				return !!v;
			});

			for (let i = 0; i < results.length; i++) {
				let r = results[i];
				if (r) {
					if (r.code === StatusCodes.UNAUTHORIZED) {
						return {
							redirect: {
								destination: "/signIn",
								permanent: true,
							},
						};
					}
					if (!r.success) {
						return { props: { error: r!.message } };
					}
					props = { ...props, ...r!.data };
				}
			}
			return {
				props,
			};
		}) satisfies GetServerSideProps;
}
