import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import IContextContainer from "@/server/container/IContextContainer";
import { IControllerContainer } from ".";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../exceptions";
import { onErrorResponse, onSuccessResponse } from "../utils";
import { redux } from "@/client/store";
import BaseEntity from "@/client/entities/BaseEntity";
import { addEntities } from "@/client/store/actions";
import container from "@/client/context/container";

type GSSPFactory = <K extends keyof IControllerContainer>(
	controllersNames: K[],
	route?: string
) => GetServerSideProps;

const entities: Record<string, BaseEntity> = {
	UsersController: container.resolve("UserEntity"),
	ClassesController: container.resolve("ClassEntity"),
	SubjectsController: container.resolve("SubjectEntity"),
};

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
							const normal = entities[name].normalize(r);
							store.dispatch(addEntities(normal.entities));
							data = normal;
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
					}
				}
				return {
					props: onErrorResponse(error as Error),
				};
			}
			return {
				props: onSuccessResponse(data),
			};
		});
}
