import container from "@/server/container/container";
import BaseController from "@/server/controllers/BaseController";
import { Logger } from "@/server/logger";
import { Route } from "@/server/utils/router/Route";
import { NextApiRequest, NextApiResponse } from "next";

function slugToRoute(slug: string | string[] | undefined): string {
	slug = slug ? (Array.isArray(slug) ? slug : [slug]) : [];
	return `/api/${slug.join("/")}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const path = slugToRoute(req.query.slug);
  // const route = BaseController.getInvokeOutput(req);
	const routesData: [string, string][] =
		Reflect.getMetadata('routes', BaseController) ?? [];
	const finded = routesData.map(([route, controller]) => ([new Route(route), controller] as [Route, string]))
		.find(([route]) => route.isPathMatch(path)) ?? null;

		if (finded && container.hasRegistration(finded[1])) {
		const route = finded[0];
		const name = finded[1];
		const controller: BaseController = container.resolve(name);
		req.query = {
			...req.query,
			...(route.getDynamicValues(path) ?? {}),
		}
    Logger.info("Requesting controller: ", name, " for route: ", route.toString(), " with path: ", path);
		controller.handler(route.toString())(req, res);
	} else if (finded) {
		const route = finded[0];
		Logger.error("Controller not found for route: ", route.toString(), " but route matched.");
	} else {
		// res.writeHead(301, {
		// 	Location: "/notFound",
		// });
		// res.end();
		res.status(404).json({ error: "Not Found", path });
	}
}
