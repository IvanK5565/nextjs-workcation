import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import IContextContainer from "../IContextContainer";
import { IControllerContainer } from "../controllers";

type RouterRun = ((req: NextApiRequest, res: NextApiResponse) => Promise<any>)

export default function getServerSidePropsContainer(ctx: IContextContainer) {
  return <K extends keyof IControllerContainer>(route: string, controllersNames: K[]): GetServerSideProps => {
    const gssp:GetServerSideProps = (async (context: GetServerSidePropsContext) => {
      const req: NextApiRequest = Object.assign(context.req,{query:context.query, body:{}, env:{}});
      req.query = context.query;
      let props = {};

      try {
            const promises = controllersNames.map((name) => {
          let ctrl = ctx[name];
          let handler:RouterRun = ctrl.handler();
          return handler(req, context.res as NextApiResponse);
        })
        let results = await Promise.all(promises)

        results.forEach(result => {
          props = { ...props, ...result };
        })
        return {
          props,
        }
      } catch (error) {
        console.error("GSSP ERROR: ", error);
        return {
          props: {
            error: (error as Error).message
          }
        }
      }
    }) satisfies GetServerSideProps;

    return gssp;
  }
}

export type GSSPFactory = (<K extends keyof IControllerContainer>(route: string, controllersNames: K[]) => GetServerSideProps)
