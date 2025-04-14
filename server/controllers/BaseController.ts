import BaseContext from "../BaseContext";
import { IService } from "../services/index";
import IContextContainer from "../IContextContainer";
import { RouteMetaData } from "../API/decorators";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";


export type Middleware = (req: any, res: any, next: Function) => void;
export type Endpoint = {
  method: string,
  handler: string
}

export default abstract class BaseController extends BaseContext {

  protected service: IService;

  protected abstract getService(): IService;

  constructor(di: IContextContainer) {
    super(di);
    this.service = this.getService();
  }

  public handlerSSR(path: string) {
    const controller = this;
    const router = createRouter<NextApiRequest, NextApiResponse>();
    router.use(async (req, res, next) => {
      try {
        return await next();
      } catch (e) {
        console.error(e);
        return { props: { error: (e as Error).message } };
      }
    })
    // .get(async (req,res)=>{
    //   throw 'MyError'
    // })
    if (Reflect.hasMetadata('middlewares', controller)) {
      let globalUses = Reflect.getMetadata('middlewares', controller) as Middleware[];
      globalUses.forEach(middleware => router.use(middleware));
    }

    if (Reflect.hasMetadata('ssr:'+path, controller)) {
      let { endpoints }: RouteMetaData = Reflect.getMetadata('ssr:'+path, controller);
      endpoints.forEach(e => {
        /** router.method(controller.handler.bind(controller)) */
        (router as any)[e.method]((controller as any)[e.handler].bind(controller))
      });

    }
    router.all((req, res) => {
      return { notFound: true };
    });
    // const handler = async (req: any, res: any) => { return await router.run(req, res) as { props: any } };
    return router.run.bind(router);
  }

  // public handlerSSR(path: string) {
  //   const controller = this as any;
  //   if (Reflect.hasMetadata(path, controller)) {

  //     const handlerName: string = Reflect.getMetadata(path, controller);

  //     return controller[handlerName].bind(this);
  //   }
  //   return () => {
  //     return { notFound: true }
  //   };
  // }

  public handler(path: string) {
    const controller = this;
    const router = createRouter<NextApiRequest, NextApiResponse>();
    if (Reflect.hasMetadata('middlewares', controller)) {
      let globalUses = Reflect.getMetadata('middlewares', controller) as Middleware[];
      globalUses.forEach(middleware => router.use(middleware));
    }

    if (Reflect.hasMetadata(path, controller)) {
      let { middlewares, endpoints }: RouteMetaData = Reflect.getMetadata(path, controller);
      middlewares.forEach(middleware => {
        router.use(middleware.bind(this))
      });
      endpoints.forEach(e => {
        /** router.method(controller.handler.bind(controller)) */
        (router as any)[e.method]((controller as any)[e.handler].bind(controller))
      });

    }
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
      },
    });
  }
}