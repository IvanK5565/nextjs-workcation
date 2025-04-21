import { Endpoint, Middleware } from "./BaseController";

export type RouteMetaData = {
  middlewares: Middleware[],
  endpoints: Endpoint[],
}

function getMetaData(key: string, target: any): RouteMetaData {
  return Reflect.getMetadata(key, target) ?? {
    middlewares: [],
    endpoints: [],
  };
}

function createEndpointDecorator(route:string, method: string){
  return function (target: any, propertyKey: string) {
    let handlers: RouteMetaData = getMetaData(route, target);
    let endpoint: Endpoint = {
      method: method,
      handler: propertyKey,
    }
    handlers.endpoints.push(endpoint);
    Reflect.defineMetadata(route, handlers, target);
  }
}


export function GET(route: string) {
  return createEndpointDecorator(route, 'get')
}
export function POST(route: string) {
  return createEndpointDecorator(route, 'post')
}
export function DELETE(route: string) {
  return createEndpointDecorator(route, 'delete')
}
export function SSR(route: string) {
  return createEndpointDecorator(route, 'ssr')
}




export function USE(middleware: Middleware): Function;
export function USE(middleware: Middleware, route: string): Function;
export function USE(middleware: Middleware, route?: string): Function {
  if (route) {
    return function (target: any, _propertyKey: string) {
      let handlers: RouteMetaData = getMetaData(route, target);
      handlers.middlewares.push(middleware);
      Reflect.defineMetadata(route, handlers, target);
    }
  }
  return function (constructor: Middleware) {
    const target = constructor.prototype;
    let middlewares: Middleware[] = Reflect.getMetadata('middlewares', target) ?? [];
    middlewares.push(middleware);
    Reflect.defineMetadata('middlewares', middlewares, target);
  }
}

// export function SSR(route: string) {
//     return createEndpointDecorator(`ssr:${route}`, 'get')
// }