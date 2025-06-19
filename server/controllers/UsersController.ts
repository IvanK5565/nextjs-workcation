import type { NextApiRequest } from "next";
import BaseController from "./BaseController";
import { DEFAULT_LIMIT, DEFAULT_PAGE, UserRole, UserStatus } from "@/constants";
import { IService } from "../services";
import { Auth, Body, DELETE, Entity, GET, POST } from "./decorators";
import { AnswerType } from "@/types";
import type { ActionProps } from "@/types";
import { GRANT, ROLE } from "@/acl/types";
import { AccessDeniedError, ApiError } from "../exceptions";
import { registerBodySchema } from "../lib/schemas";

@Entity('UserEntity')
export default class UsersController extends BaseController {
	protected getService(): IService {
		return this.di.UsersService;
	}

	@GET("/classes/[id]", {
		allow: {
			[ROLE.ADMIN]: [GRANT.WRITE],
		},
	})
	@GET('/diary', {
		allow: {
			[ROLE.TEACHER]:[GRANT.READ]
		}
	})
	public getTeachersSSR({ guard }: ActionProps) {
		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return this.di.UsersService.findByFilter(undefined, undefined, {
			role: UserRole.TEACHER,
		});
	}

	@GET('/classes/new', {
		allow:{
			[ROLE.TEACHER]: [GRANT.READ]
		}
	})
	public getAuth({ guard }: ActionProps){
		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return {};
	}

	@Body(registerBodySchema)
	@POST("/api/register", { allow: { [ROLE.GUEST]: [GRANT.WRITE] } })
	public async signUp({ body }: ActionProps) {
		return this.di.UsersService.save(body);
	}

	@GET("/api/login")
	public signIn(req: NextApiRequest) {
		const { email, password } = req.query;
		return this.di.UsersService.signIn(email as string, password as string);
	}

	@POST("/api/users", {allow: { [ROLE.TEACHER]:[GRANT.WRITE]}})
	@POST("/api/users/[id]")
	public save({ guard,body }: ActionProps) {
		if(!guard.allow(GRANT.WRITE)) throw new AccessDeniedError();
		return this.di.UsersService.save(body);
	}

	@GET("/api/users/[id]")
	public findById({ query }: ActionProps) {
		const { id } = query!;
		const numId = Number(id);
		return this.di.UsersService.findById(numId);
	}

	@Auth
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
			[ROLE.ADMIN]: [GRANT.READ],
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

	@DELETE("/api/users", { allow: { [ROLE.ADMIN]: [GRANT.EXECUTE] } })
	public deleteById({ query, guard }: ActionProps) {
		if (!guard.allow(GRANT.EXECUTE)) throw new AccessDeniedError();
		const id = Number(query!.id);
		return this.di.UsersService.delete(id);
	}

	@GET('/api/users/teachers', { allow: { [ROLE.TEACHER]: [GRANT.READ] } })
	public getTeachers({ guard }: ActionProps) {
		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return this.di.UsersService.findByRole(UserRole.TEACHER)
	}

	@GET('/api/users/students', { allow: { [ROLE.TEACHER]: [GRANT.READ] } })
	public getStudents({ guard }: ActionProps) {
		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return this.di.UsersService.findByRole(UserRole.STUDENT)
	}

	@GET("/api/users/active", { allow: { [ROLE.ADMIN]: [GRANT.READ] } })
	public getActiveUsers({ guard }: ActionProps) {
		if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
		return this.di.UsersService.findByStatus(UserStatus.ACTIVE);
	}

	// export interface IPagerParams {
	// 	pageName?: string; // paginator name
	// 	// sort?: object;      // object with sorting key/values
	// 	sort?: ISortParams;
	// 	filter?: object; //object;    // object with filtering key/values
	// 	page?: number; // page number
	// 	perPage: number; // count items on one page
	// 	force?: boolean; // reload data in the redux and pager
	// 	count?: number; // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
	// 	entityName?: string;
	// }
	@Body({
		type:'object',
		properties:{
			sort: {type:'object'},
			pageName: { type:'string' },
			perPage: { type:'string' },
			page: { type:'integer' },
			count: { type:'integer' },
			entityName: { type:'string' },
			filter: { type:'object' },
		},
		required:['perPage']
	})
	@POST('/api/users/page', {allow:{[ROLE.GUEST]:[GRANT.EXECUTE]}})
	public pageUsers({pager}:ActionProps){
		return this.di.UsersService.pageUsers(pager);
	}
}
