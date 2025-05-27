import { GRANT, IAllowDeny, IGrants } from "@/acl/types";
import { validate } from "@/server/lib/validate";
import { MethodHandler, Middleware } from "@/types";
import "reflect-metadata";
import { rules } from "@/config.acl";
import { authMiddleware } from "../lib/authMiddleware";
import BaseController from "./BaseController";

type Decorator = (target: object, propertyKey: string) => void;
type EndpointDecorator = (route: string, allow?: IAllowDeny) => Decorator;

function addMethodToRouteRules(routeRules: IAllowDeny, method: GRANT) {
	if (routeRules.allow) {
		routeRules.allow = Object.entries(routeRules.allow).reduce(
			(acc, [key, value]) => {
				acc[key] = [...value, method];
				return acc;
			},
			{} as IGrants
		);
	}
	if (routeRules.deny) {
		routeRules.deny = Object.entries(routeRules.deny).reduce(
			(acc, [key, value]) => {
				acc[key] = [...value, method];
				return acc;
			},
			{} as IGrants
		);
	}
	return routeRules;
}
type EDecoratorFactory = (
	method: "get" | "post" | "put" | "delete"
) => EndpointDecorator;

const endpointDecorator: EDecoratorFactory =
	(method) => (route, pRules) => (target, propertyKey) => {
		const endpoints: MethodHandler[] = Reflect.getMetadata(route, target) ?? [];
		endpoints.push({ method, handler: propertyKey });
		Reflect.defineMetadata(route, endpoints, target);
		if (pRules) {
			const reg = /\[([a-zA-Z0-9_-]+)\]/g;
			const routePattern = route.replace(reg, "*");
			rules[routePattern] = addMethodToRouteRules(pRules, GRANT.GET);
		}
		const routes:[string, string][] = BaseController.getRoutes();
		if(!routes.find(rc => rc[0] === route && rc[1] === target.constructor.name))
			routes.push([route, target.constructor.name])
		Reflect.defineMetadata('routes', routes, BaseController);
	};

export const GET = endpointDecorator("get");
export const POST = endpointDecorator("post");
export const PUT = endpointDecorator("put");
export const DELETE = endpointDecorator("delete");

// function endpointDecorator(route: string, method: string, allow:IGrants) {
// 	return (target: any, propertyKey: string) => {
// 		let endpoints: MethodHandler[] = Reflect.getMetadata(route, target) ?? [];
// 		endpoints.push({ method, handler: propertyKey });
// 		Reflect.defineMetadata(route, endpoints, target);
// 	};
// };
// export const GET = (route: string, allow:IGrants) => endpointDecorator(route, "get", allow);
// export const POST = (route: string, allow:IGrants) => endpointDecorator(route, "post", allow);
// export const DELETE = (route: string, allow:IGrants) => endpointDecorator(route, "delete", allow);
// export const PUT = (route: string, allow:IGrants) => endpointDecorator(route, "put", allow);

export const USE = (middleware: Middleware) => {
	return (target: object['constructor'], propertyKey?: string) => {
		const middlewares: Middleware[] =
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

export const AUTH = USE(authMiddleware);

// export const QUERY = (schema: object) => USE(validate(schema, 'query'));
// export const BODY = (schema: object) => USE(validate(schema, 'body'));
function validateDecorator(target: "body" | "query") {
	return (schema: object) => USE(validate(schema, target));
}
export const QUERY = validateDecorator("query");
export const BODY = validateDecorator("body");
