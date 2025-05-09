
// import bcrypt from "bcrypt"
import { ApiError } from "@/server/exceptions";
import { AnswerType, type Response } from "@/types";
import { StatusCodes } from "http-status-codes";

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }

export function onSuccessResponse(data: any):Response {
	return {
		code: StatusCodes.OK,
		success: true,
		data: data,
		type: AnswerType.Data,
	};
}
export function onErrorResponse(error: Error):Response {
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