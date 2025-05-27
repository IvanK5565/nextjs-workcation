import type { NextApiRequest } from "next";
import BaseController from "./BaseController";
import { DEFAULT_LIMIT, DEFAULT_PAGE, UserRole } from "@/constants";
import { IService } from "../services";
import { AUTH, BODY, DELETE, GET, POST, USE /*, SSR*/ } from "./decorators";
import { getHousesData } from "@/pages/api/data";
import { AnswerType } from "@/types";
import type { ActionProps } from "@/types";
import { GRANT, ROLE } from "@/acl/types";
import { AccessDeniedError, ApiError } from "../exceptions";

// @USE(authMiddleware)
export default class UsersController extends BaseController {
	protected getService(): IService {
		return this.di.UsersService;
	}

	// @SSR('/')
	@GET("/")
	public async getData() {
		const data = getHousesData();
		return { data };
	}

	// @SSR('/classes/[id]')
	@GET("/classes/[id]", {
		allow: {
			[ROLE.ADMIN]: [GRANT.WRITE],
		},
	})
	public getTeachersSSR({guard}:ActionProps) {
    if(!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return this.di.UsersService.findByFilter(100, 1, {
			role: UserRole.TEACHER,
		});
		// .then(teachers => ({teachers}))
	}

	@BODY({
		type: "object",
		properties: {
			id: { type: "integer", nullable: true },
			firstName: { type: "string" },
			lastName: { type: "string" },
			email: { type: "string", format: "email" },
			password: { type: "string", format: "password" },
			role: { type: "string" },
			status: { type: "string" },
		},
		required: ["firstName", "lastName", "email", "password", "role", "status"],
	})
	@POST("/api/register", {
		allow: {
			[ROLE.GUEST]: [GRANT.WRITE],
		},
	})
	public async signUp({ body }: ActionProps) {
		return this.di.UsersService.save(body);
	}

	@GET("/api/login")
	public signIn(req: NextApiRequest) {
		const { email, password } = req.query;
		return this.di.UsersService.signIn(email as string, password as string);
	}

	@POST("/api/users")
	@POST("/api/users/[id]")
	public save({ body }: ActionProps) {
		return this.di.UsersService.save(body);
	}

	@GET("/api/users/[id]")
	public findById({ query }: ActionProps) {
		const { id } = query!;
		const numId = Number(id);
		return this.di.UsersService.findById(numId);
	}

	@AUTH
	@GET("/profile")
	public profile({ session }: ActionProps) {
		if (!session) {
			throw new ApiError(
				"Session is null in secured action",
				500,
				AnswerType.Log
			);
		}
		return this.di.UsersService.findByEmail(session.user.email);
	}

	@GET("/api/users", {
		allow: {
			[ROLE.GUEST]: [GRANT.READ],
		},
	})
	public findByFilter({ query, guard }: ActionProps) {
		const { limit, page, ...filters } = query as Record<string, string>;
		let parsedLimit = Number(limit);
		let parsedPage = Number(page);
		if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
		if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();

		return this.di.UsersService.findByFilter(
			parsedLimit,
			Math.max(1, parsedPage),
			filters
		);
	}

	@DELETE("/api/users")
	public deleteById({ query }: ActionProps) {
		const id = Number(query!.id);
		return this.di.UsersService.delete(id);
	}
}
