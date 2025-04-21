import { GetServerSideProps, GetServerSidePropsContext } from "next";
import IContextContainer from "../IContextContainer";
import { IControllerContainer } from "../controllers";
import { IncomingMessage, ServerResponse } from "http";

type RouterRun = ((req: SSRRequest, res: ServerResponse<SSRRequest>) => Promise<any>)
export type SSRRequest = IncomingMessage &
{
  query?: Partial<{ [key: string]: string | string[]; }>,
}

export default function getServerSidePropsContainer(ctx: IContextContainer) {
  return <K extends keyof IControllerContainer>(route: string, controllersNames: K[]): GetServerSideProps => {
    const gssp:GetServerSideProps = (async (context: GetServerSidePropsContext) => {
      const req: SSRRequest = context.req;
      req.query = context.query;
      let props = {};

      try {
        const promises = controllersNames.map((name) => {
          let ctrl = ctx[name];
          let handler:RouterRun = ctrl.handler(route) as any;
          return handler(req, context.res);
        })
        let results = await Promise.all(promises)

        results.forEach(result => {
          props = { ...props, ...result };
        })
        // console.log("GSSP PROPS: ", props)
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
