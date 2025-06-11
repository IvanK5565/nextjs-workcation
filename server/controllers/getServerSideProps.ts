import { NextApiResponse } from "next";
import IContextContainer from "@/server/container/IContextContainer";
import { StatusCodes } from "http-status-codes";
import { AccessDeniedError, ApiError } from "../exceptions";
import { redux } from "@/client/store";
import { addEntities } from "@/client/store/actions";
import { Logger } from "../logger";
import { ExtendedRequest } from "./BaseController";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import { GSSPFactory } from "@/types";



export default function getServerSidePropsContainer(
	ctx: IContextContainer
): GSSPFactory {
	return (controllersNames, isPublic=false, route?) =>
		redux.getServerSideProps((store) => async (context) => {
			// init
			const { locale } = context;
			const props = {
				...(await serverSideTranslations(locale ?? 'en', ['common']))
			}
			const req: ExtendedRequest = Object.assign(context.req, {
				query: context.query,
				body: {},
				env: {},
				// session: await getServerSession()
			});
			req.session = await getServerSession<AuthOptions, Session>(
				req,
				context.res,
				ctx.authOptions
			);
			if(!isPublic && !req.session){
				return {
						redirect: { destination: "/403", permanent: true },
					};
			}
			let auth: object = { ...(req.session?.acl ?? {roles:null, rules:null}), identity: (req.session?.user ?? null) };
			// collect promises from controllers
			const promises = controllersNames.map((name) => {
				return ctx[name]
					.handler(route)(req, context.res as NextApiResponse)
					.then((r) => {
						auth = { ...(req.session?.acl ?? null), identity: (req.session?.user ?? null) };
						if (r) {
							const entity = ctx[name].getEntityName();
							if (entity) {
								const normalize = redux.normalizer(entity);
								const normal = normalize(r);
								normal.result = normal.result ?? null;
								store.dispatch(addEntities(normal.entities));
							} else {
								Logger.warn(`Controller ${name} does not have an entity associated with it.`);
							}
						}
					});
			});
			Logger.log('gssp handlers count', promises.length)
			// run promises
			try {
				store.dispatch({ type: 'setAuth', payload: { auth } })
				await Promise.all(promises);
			} catch (error) {
				ctx.Logger.error("GSSP ERROR: ", (error as Error).message);

				if (error instanceof AccessDeniedError) {
					return {
						redirect: { destination: "/403", permanent: true },
					};
				}

				if (error instanceof ApiError) {
					switch (error.code) {
						case StatusCodes.UNAUTHORIZED:
							return {
								redirect: { destination: "/signIn", permanent: true },
							};
						case StatusCodes.NOT_FOUND:
							return {
								notFound: true,
							};
						// case StatusCodes.METHOD_NOT_ALLOWED:
						// 	return { props };

					}
				}
				return {
					// props: onErrorResponse(error as Error),
					redirect: { destination: "/404", permanent: false },
				};
			}
			// end
			return {
				props
			};
		});
}
