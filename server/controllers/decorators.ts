import { validate } from "@/server/lib/validate";
import { MethodHandler, Middleware } from "@/types";
import 'reflect-metadata'

export const EndpointDecorator =
	(route: string, method: string) => (target: any, propertyKey: string) => {
		let endpoints: MethodHandler[] = Reflect.getMetadata(route, target) ?? [];
		endpoints.push({ method, handler: propertyKey });
		Reflect.defineMetadata(route, endpoints, target);
	};
export const GET = (route: string) => EndpointDecorator(route, "get");
export const POST = (route: string) => EndpointDecorator(route, "post");
export const DELETE = (route: string) => EndpointDecorator(route, "delete");
export const PUT = (route: string) => EndpointDecorator(route, "put");

export const USE = (middleware: Middleware) => {
	return (target: any, propertyKey?: string) => {
		let middlewares: Middleware[] =
			Reflect.getMetadata(
				"middlewares",
				propertyKey ? target : target.prototype,
				propertyKey ?? ""
			) ?? [];

		middlewares.push(middleware);

		Reflect.defineMetadata(
			"middlewares",
			middlewares,
			propertyKey ? target : target.prototype,
			propertyKey ?? ""
		);
	};
};

export const QUERY = (schema: object) => USE(validate(schema, 'query'));
export const BODY = (schema: object) => USE(validate(schema, 'body'));
