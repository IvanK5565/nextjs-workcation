import BaseContext from "../BaseContext";
import { RouteMetaData } from "./decorators";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { SSRRequest } from "../utils/getServerSideProps";
import { StringMap } from "../utils/constants";

export type Middleware = (req: NextApiRequest | SSRRequest, res: NextApiResponse, next: Function) => void | Promise<void>;
export type Endpoint = {
  method: string,
  handler: string
}
type Action = ((req: NextApiRequest | SSRRequest, res: NextApiResponse) => Promise<StringMap>)

export default abstract class BaseController extends BaseContext {

  private getAction(handler: string, ssr?: boolean): Action {
    return async (req: NextApiRequest | SSRRequest, res: NextApiResponse) => {
      const fn: Action = (this as any)[handler].bind(this);

      try {

        const results = await fn(req, res);
        if (ssr) return JSON.parse(JSON.stringify(results));
        return res.status(200).send(JSON.parse(JSON.stringify(results)));

      } catch (error) {
        console.error(`Error in action: ${handler}\n${error}`);
        if (ssr) return { error: (error as Error).message };
        return res.status(500).send(error);
      }
    }
  }

  private createBaseRouter(path: string) {
    const router = createRouter<SSRRequest | NextApiRequest, NextApiResponse>();
    if (Reflect.hasMetadata('middlewares', this)) {
      let globalUses:Middleware[] = Reflect.getMetadata('middlewares', this);
      globalUses.forEach(middleware => router.use(middleware.bind(this)));
    }
    if (Reflect.hasMetadata(path, this)) {
      const { endpoints, middlewares }: RouteMetaData = Reflect.getMetadata(path, this)
      middlewares.forEach(m => {
        router.use(m.bind(this));
      })
      endpoints.forEach(e => {
        if (e.method === 'ssr') {
          router.get(this.getAction(e.handler, true));
        } else {
          (router as any)[e.method](this.getAction(e.handler));
        }
      })
    }
    return router;
  }

  public handler(path: string) {
    const router = this.createBaseRouter(path)
    if (path.startsWith('api/')) {
      router.all((req, res) => {
        res.status(405).json({
          error: "Method not allowed",
        });
      });
      return router.handler({
        onError: (err, req, res) => {
          console.error("Error in handler: ", err);
          res.status(500).json({
            error: (err as Error).message,
          });
        }
      });
    }
    router.all((req, res) => {
      return { notFound: true };
    });
    return router.run.bind(router);
  }

  // private createBaseRouter() {
  //   const controller = this;
  //   const router = createRouter<SSRRequest | NextApiRequest, NextApiResponse>();
  //   router.use(async (_req, res, next) => {
  //     try {
  //       return await next();
  //     } catch (e) {
  //       console.error(e);
  //       res.status(500).send(e);
  //       return { error: (e as Error).message };
  //     }
  //   })
  //   if (Reflect.hasMetadata('middlewares', controller)) {
  //     let globalUses = Reflect.getMetadata('middlewares', controller) as Middleware[];
  //     globalUses.forEach(middleware => router.use(middleware));
  //   }
  //   return router;
  // }
  // public handlerSSR(path: string) {
  //   const controller = this;
  //   const router = this.createBaseRouter();

  //   if (Reflect.hasMetadata('ssr:' + path, controller)) {
  //     let { endpoints }: RouteMetaData = Reflect.getMetadata('ssr:' + path, controller);
  //     endpoints.forEach(e => {
  //       const action = this.getAction(e.handler, true);
  //       if(e.method === 'ssr') router.get(action);
  //       (router as any)[e.method](action)
  //     });

  //   }
  //   router.all((req, res) => {
  //     return { notFound: true };
  //   });
  //   return router.run.bind(router);
  // }

  // public handler(path: string) {
  //   let ssr = true;
  //   if (path.startsWith('api/')) {
  //     ssr = false;
  //   }
  //   const controller = this;
  //   const router = this.createBaseRouter();

  //   if (Reflect.hasMetadata(path, controller)) {
  //     let { middlewares, endpoints }: RouteMetaData = Reflect.getMetadata(path, controller);
  //     middlewares.forEach(middleware => {
  //       router.use(middleware.bind(this))
  //     });
  //     endpoints.forEach(e => {
  //       const action = this.getAction(e.handler);
  //       (router as any)[e.method](action)
  //     });
  //   }
  //   router.all((req, res) => {
  //     res.status(405).json({
  //       error: "Method not allowed",
  //     });
  //   });
  //   return router.handler({
  //     onError: (err, req, res) => {
  //       console.error("Error in handler: ", err);
  //       res.status(500).json({
  //         error: (err as Error).message,
  //       });
  //     },
  //   });
  // }
}

