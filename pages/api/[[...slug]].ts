import container from "@/server/container/container";
import BaseController from "@/server/controllers/BaseController";
import { Logger } from "@/server/logger";
import { Route } from "@/server/utils/router/Route";
import { NextApiRequest, NextApiResponse } from "next";

function slugToRoute(slug: string | string[] | undefined): string {
	slug = slug ? (Array.isArray(slug) ? slug : [slug]) : [];
	return `/api/${slug.join("/")}`;
}

function findBestMatch(routes: [Route, string][], path: string) {
	const filtered = routes.filter(([route]) => route.isPathMatch(path));
	if (filtered.length < 1) return null;
	let finded = filtered[0];
	for (let i = 1; i < filtered.length; i++) {
		const comparingValue = finded[0].compare(filtered[i][0]);
		if (comparingValue > 0) {
			finded = filtered[i];
		} else if (comparingValue == 0) {
			Logger.warn('The same routes matching the path finded:',
				`${finded[0].toString()} === ${filtered[i][0].toString()}, path: ${path}`,
			'controllers:', finded[1], filtered[1][1])
		}
	}
	return finded;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const path = slugToRoute(req.query.slug);
	// const route = BaseController.getInvokeOutput(req);
	const routesData: [string, string][] =
		Reflect.getMetadata('routes', BaseController) ?? [];
	const preparedRoutes = routesData.map(([route, controller]) => ([new Route(route), controller] as [Route, string]));
	const finded = findBestMatch(preparedRoutes, path)
	Logger.log('Finded route', finded?.[0].toString(), 'for path', path)

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
