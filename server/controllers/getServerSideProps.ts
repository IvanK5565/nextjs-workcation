import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import IContextContainer from "@/server/container/IContextContainer";
import { IControllerContainer } from ".";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../exceptions";
import { onSuccessResponse } from "../utils";
import { redux } from "@/client/store";
import { addEntities } from "@/client/store/actions";
import { Logger } from "../logger";

type GSSPFactory = (
	controllersNames: (keyof IControllerContainer)[],
	route?: string
) => GetServerSideProps;

export default function getServerSidePropsContainer(
	ctx: IContextContainer
): GSSPFactory {
	return (controllersNames, route?) =>
		redux.getServerSideProps((store) => async (context) => {
			const req: NextApiRequest = Object.assign(context.req, {
				query: context.query,
				body: {},
				env: {},
			});
			let data: object = {};
			const promises = controllersNames.map((name) => {
				return ctx[name]
					.handler(route)(req, context.res as NextApiResponse)
					.then((r) => {
						if (r) {
							const entity = ctx[name].getEntityName();
							if (entity) {
								const normalize = redux.normalizer(entity);
								const normal = normalize(r);
								normal.result = normal.result ?? null;
								store.dispatch(addEntities(normal.entities));
								data = normal;
							} else {
								Logger.warn(`Controller ${name} does not have an entity associated with it.`);
								data = r;
							}
						}
					});
			});
			try {
				await Promise.all(promises);
			} catch (error) {
				ctx.Logger.error("GSSP ERROR: ", (error as Error).message);

				if (error instanceof ApiError) {
					switch (error.code) {
						case StatusCodes.UNAUTHORIZED:
							return { redirect: { destination: "/signIn", permanent: true } };
						case StatusCodes.NOT_FOUND:
							return { notFound: true };
						case StatusCodes.METHOD_NOT_ALLOWED:
							return { props: {} };
					}
				}
				return {
					// props: onErrorResponse(error as Error),
					redirect: { destination: "/404", permanent: false },
				};
			}
			return {
				props: onSuccessResponse(data),
			};
		});
}
