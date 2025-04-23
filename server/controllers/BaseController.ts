import BaseContext from "../BaseContext";
import { createRouter, NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { StringRecord } from "../utils/constants";
import { Model } from "sequelize";
import { IncomingMessage } from "http";

type ApiResult = any;
export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => ApiResult | Promise<ApiResult>;
export type Endpoint = {
  method: string,
  handler: string
}
type ActionAdapter = ((req: NextApiRequest, res: NextApiResponse) => Promise<any>)
type Action = ((req: NextApiRequest) => Promise<StringRecord<string> | Model | Model[]>)

class ApiError extends Error {
  public code: number;
  constructor(mess: string, code: number) {
    super(mess);
    this.code = code;
  }
}

export default abstract class BaseController extends BaseContext {

  private createAction(handler: string): ActionAdapter {
    return (req: NextApiRequest, _res: NextApiResponse) => {
      const fn: Action = (this as any)[handler].bind(this);
      return fn(req)
        .then(results => JSON.parse(JSON.stringify(results)))
        .catch(error => {
          let mess = `Error in action: ${handler}\n\t${error.message}`;
          console.error(mess)
          throw new ApiError(mess, 500)
        })
    }
  }

  private getInvokeOutput(req:IncomingMessage) {
    const symbols = Object.getOwnPropertySymbols(req);
    const metaSymbol = symbols.find(
      sym => sym.toString() === 'Symbol(NextInternalRequestMeta)'
      );
    if (!metaSymbol) return null;
  
    const meta = (req as any)[metaSymbol];
    return meta?.invokeOutput || null;
  }

  private getMiddlewares = (handler?: string): Middleware[] => ((handler ? Reflect.getMetadata('middlewares', this, handler)
    : Reflect.getMetadata('middlewares', this)) ?? []).reverse();

  public handler(path: string, ssr:boolean = false) {
    // const ssr = !(path.startsWith('/api/'));
    const router = createRouter<NextApiRequest, NextApiResponse>();
    router.use(async (_req, res, next) => {
      try {
        const data = await next();
        return ssr ? data : res.status(200).json(data);
      } catch (error) {
        return ssr ? (error as ApiError) : res.status((error as ApiError).code).json((error as ApiError).message)
      }
    })
    .use((_req, res, next) => {
      console.log("PATH: ", this.getInvokeOutput(_req));
      return next();
    })
    const globalUses: Middleware[] = this.getMiddlewares();
    globalUses.forEach(middleware => router.use(middleware));

    const endpoints: Endpoint[] = Reflect.getMetadata(path, this) ?? [];
    endpoints.forEach(e => {
      const middlewares = this.getMiddlewares(e.handler);

      (router as any)[e.method](
        ...middlewares,
        this.createAction(e.handler)
      );
    });

    router.all((_req, _res) => { throw new ApiError(`Method not allowed for path: ${path}`, 405) });

    return ssr ? router.run.bind(router)
      : router.handler({
        onError: (err, _req, res) => {
          console.error("Error in handler: ", err);
          res.status(500).json({ error: (err as Error).message });
        }
      });
  }
}
