import { Endpoint, Middleware } from "./BaseController";

// const getMetadata = (key: string, target: any, propertyKey?: string) => propertyKey ?
//   Reflect.getMetadata(key, target, propertyKey)
//   : Reflect.getMetadata(key, target.prototype);
// const setMetadata = (key: string, value: any, target: any, propertyKey?: string) => propertyKey ?
//   Reflect.defineMetadata(key, value, target, propertyKey)
//   : Reflect.defineMetadata(key, value, target.prototype);

const createEndpointDecorator = (route: string, method: string) => (target: any, propertyKey: string) => {
  let endpoints: Endpoint[] = Reflect.getMetadata(route, target) ?? [];
  endpoints.push({ method, handler: propertyKey, });
  Reflect.defineMetadata(route, endpoints, target);
}



export const GET = (route: string) => createEndpointDecorator(route, 'get');
export const POST = (route: string) => createEndpointDecorator(route, 'post');
export const DELETE = (route: string) => createEndpointDecorator(route, 'delete');
export const PUT = (route: string) => createEndpointDecorator(route, 'put');

export const USE = (middleware: Middleware) => (target: any, propertyKey?: string) => {
  let middlewares: Middleware[] = Reflect.getMetadata(
    'middlewares', 
    propertyKey ? target : target.prototype, 
    propertyKey ?? '') ?? [];

  middlewares.push(middleware);

  Reflect.defineMetadata(
    'middlewares',
    middlewares,
    propertyKey ? target : target.prototype, 
    propertyKey ?? '')
}
