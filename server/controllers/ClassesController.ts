import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/constants";
import BaseController from "./BaseController";
import type { ActionProps } from "@/types";
import { BODY, DELETE, GET, POST, QUERY, USE /*,SSR*/ } from "./decorators";
import { authMiddleware } from "../lib/authMiddleware";

@USE((_req, _res, next) => {
	console.log("CLASSES USE 1");
	return next();
})
@USE((_req, _res, next) => {
	console.log("CLASSES USE 2");
	return next();
})
export default class ClassesController extends BaseController {
	@QUERY({
		type: "object",
		properties: {
			id: { type: "string", pattern:'^\\d+$' },
		}
	})
	@GET("/classes/[id]")
	@USE(authMiddleware)
	public getEditClassDataSSR(props: ActionProps) {
		const { id } = props.query!;
		return this.di.ClassesService.findById(Number(id)).then((res) => ({
			_class: res,
		}));
	}

	@USE((_req, _res, next) => {
		console.log("save");
		return next();
	})
	@POST("/api/classes")
	@POST("/api/classes/[id]")
	@BODY({
		type: "object",
		properties: {
			id: { type: "integer", nullable:true },
			teacher_id: { type: "integer" },
			title: { type: "string" },
			year: { type: "integer" },
			status: { type: "string" },
		},
		required:['teacher_id', 'title', 'year', 'status']
	})
	public save({ body }: ActionProps) {
		return this.di.ClassesService.save(JSON.parse(body!));
	}

	// @USE(
	// 	validate({
	// 		query: {
	// 			type: "object",
	// 			properties: {
	// 				id: { type: "string", pattern: "^\\d+$" },
	// 			},
	// 			required: ["id"],
	// 		},
	// 	})
	// )
	/////
	@QUERY({
		type: "object",
		properties: {
			id: { type: "string", pattern:'^\\d+$' },
		}
	})
	@GET("/api/classes/[id]")
	public findById({ query }: ActionProps) {
		const id = Number(query!.id);
		return this.di.ClassesService.findById(id);
	}

	@USE((req, res, next) => {
		console.log("METHOD USE 1");
		return next();
	})
	@USE((req, res, next) => {
		console.log("METHOD USE 2");
		return next();
	})
	@GET("/api/classes")
	public findByFilter({ query }: ActionProps) {
		const { limit, page, ...filters } = query as Record<string, string>;
		let parsedLimit = Number(limit);
		let parsedPage = Number(page);
		if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
		if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

		return this.di.ClassesService.findByFilter(
			parsedLimit,
			Math.max(1, parsedPage),
			filters
		);
	}

	@DELETE("/api/classes/[i]")
	public deleteById({ query }: ActionProps) {
		const id = Number(query!.id);

		return this.di.ClassesService.delete(id);
	}
}
