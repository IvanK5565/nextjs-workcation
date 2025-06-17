
// import bcrypt from "bcrypt"
import { IRules, ROLE } from "@/acl/types";
import { IPagerParams } from "@/client/paginatorExamples/types";
import { ApiError } from "@/server/exceptions";
import { AnswerType, type Response } from "@/types";
import { StatusCodes } from "http-status-codes";

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }

export function onSuccessResponse(data: Response['data'], pagerParams?: IPagerParams): Response {
	let pager:any = undefined;
	if (pagerParams && data && 'count' in data) {
		pager = {
			count: data.count,
			page: pagerParams.page,
			pageName: pagerParams.pageName,
			perPage: pagerParams.perPage,
			entityName: pagerParams.entityName,
		};
		data = data.items;
	}
	return {
		code: StatusCodes.OK,
		success: true,
		data: data,
		pager,
		type: AnswerType.Data,
	};
}
export function onErrorResponse(error: Error): Response {
	return {
		code:
			error instanceof ApiError
				? error.code
				: StatusCodes.INTERNAL_SERVER_ERROR,
		success: false,
		type: AnswerType.Toast,
		message: error.message,
	};
}

export function guestRules(rules: IRules) {
	return Object.fromEntries(
		Object.entries(rules)
			.filter((entry) =>
				Object.hasOwn(entry[1].allow, ROLE.GUEST) && (entry[1].deny ? Object.hasOwn(entry[1].deny, ROLE.GUEST) : true))
			.map(([res, grants]) => {
				return [res, {
					allow: { [ROLE.GUEST]: grants.allow[ROLE.GUEST] },
					deny: grants.deny ? { [ROLE.GUEST]: grants.deny[ROLE.GUEST] } : undefined
				}]
			}))
}