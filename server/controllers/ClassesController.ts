import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants";
import BaseController from "./BaseController";
import { AnswerType, type ActionProps } from "@/types";
import { DELETE, Entity, GET, POST, Query, USE } from "./decorators";
import { authMiddleware } from "../lib/authMiddleware";
import { GRANT, ROLE } from "@/acl/types";
import { AccessDeniedError, ApiError } from "../exceptions";
import { StatusCodes } from "http-status-codes";

@Entity('ClassEntity')
export default class ClassesController extends BaseController {
	@Query({
		type: "object",
		properties: {
			id: { type: "string", pattern: "^\\d+$" },
		},
	})
	@GET("/classes/[id]", {
		allow:{
			[ROLE.ADMIN]:[GRANT.READ]
		}
	})
	@USE(authMiddleware)
	public getEditClassDataSSR({query, guard}: ActionProps) {
		const { id } = query!;
		if (!guard.allow(GRANT.READ)) {
			throw new AccessDeniedError();
		}

		return this.di.ClassesService.findById(Number(id))
		// .then((res) => ({
		// 	_class: res,
		// }));
	}

	@USE((_req, _res, next) => {
		console.log("save");
		return next();
	})
	@POST("/api/classes")
	@POST("/api/classes/[id]",{
		allow:{
			[ROLE.ADMIN]:[GRANT.WRITE]
		}
	})
	// @Body({
	// 	type: "object",
	// 	properties: {
	// 		id: { type: "integer", nullable: true },
	// 		teacher_id: { type: "integer" },
	// 		title: { type: "string" },
	// 		year: { type: "integer" },
	// 		status: { type: "string" },
	// 	},
	// 	required: ["teacher_id", "title", "year", "status"],
	// })
	public save({ guard }: ActionProps) {
		if(!guard.allow(GRANT.WRITE)){
			throw new AccessDeniedError();
		}
		// return this.di.ClassesService.save(body);
		return {};
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
	@Query({
		type: "object",
		properties: {
			id: { type: "string", pattern: "^\\d+$" },
		},
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

	@GET('/api/classes/error')
	public error(){
		throw new ApiError('Expected error', StatusCodes.INTERNAL_SERVER_ERROR, AnswerType.Toast);
	}
}
