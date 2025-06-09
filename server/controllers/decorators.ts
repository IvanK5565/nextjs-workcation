import { GRANT, IAllowDeny, IGrants } from "@/acl/types";
import { validate } from "@/server/lib/validate";
import { MethodHandler, Middleware } from "@/types";
import "reflect-metadata";
import { rules } from "@/config.acl";
import { authMiddleware } from "../lib/authMiddleware";
import BaseController from "./BaseController";
import { IEntityContainer } from "@/client/entities";

type ActionDecorator = (route: string, allow?: IAllowDeny) => MethodDecorator;

function mergeGrants(a: IGrants = {}, b: IGrants = {}) {
  const result: IGrants = {};

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const valuesA = a[key] ?? [];
    const valuesB = b[key] ?? [];
    // Merge and remove duplicates
    result[key] = Array.from(new Set([...valuesA, ...valuesB]));
	}
  return result;
}
function mergeRules(a: IAllowDeny = {allow:{}}, b:IAllowDeny = {allow:{}}):IAllowDeny{
	return {
		allow: mergeGrants(a.allow, b.allow),
		deny: a.deny || b.deny ? mergeGrants(a.deny, b.deny) : undefined
	}
}

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
type ActionDecoratorFactory = (
	method: "get" | "post" | "put" | "delete"
) => ActionDecorator;

const endpointDecorator: ActionDecoratorFactory =
	(method) => (route, pRules) => (target, propertyKey) => {
		const endpoints: MethodHandler[] = Reflect.getMetadata(route, target) ?? [];
		endpoints.push({ method, handler: propertyKey as string });
		Reflect.defineMetadata(route, endpoints, target);
		if (pRules) {
			const reg = /\[([a-zA-Z0-9_-]+)\]/g;
			const routePattern = route.replace(reg, "*");
			pRules = addMethodToRouteRules(pRules, GRANT.GET);
			rules[routePattern] = mergeRules(pRules, rules[routePattern]);
		}
		const routes: [string, string][] = BaseController.getRoutes();
		if (!routes.find(rc => rc[0] === route && rc[1] === target.constructor.name))
			routes.push([route, target.constructor.name])
		Reflect.defineMetadata('routes', routes, BaseController);
	};

export const GET = endpointDecorator("get");
export const POST = endpointDecorator("post");
export const PUT = endpointDecorator("put");
export const DELETE = endpointDecorator("delete");

export const USE = (middleware: Middleware) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (target: any, propertyKey?: string) => {
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

export const Auth = USE(authMiddleware);

const validateDecorator = (target: "body" | "query") => (schema: object) => USE(validate(schema, target));

export const Query = validateDecorator("query");
export const Body = validateDecorator("body");

export const Entity: (entity: keyof IEntityContainer) => ClassDecorator = (e) => {
	return (target) => {
		Reflect.defineMetadata("entity", e, target.prototype);
	}
}