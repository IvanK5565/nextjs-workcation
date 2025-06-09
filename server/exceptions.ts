import { AnswerType } from "@/types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

class ApiError extends Error {
	public readonly code: number;
	public readonly answer: AnswerType;
	constructor(mess: string, code: number, answer: AnswerType) {
		super(mess);
		this.code = code;
		this.answer = answer;
	}
}

class InternalError extends ApiError {
	constructor(mess?: string) {
		super(
			mess || ReasonPhrases.INTERNAL_SERVER_ERROR,
			StatusCodes.INTERNAL_SERVER_ERROR,
			AnswerType.Toast
		);
	}
}

class ValidateError extends ApiError {
	constructor() {
		super('ValidateErrorMessage', StatusCodes.BAD_REQUEST, AnswerType.Toast);
	}
}

class NotAllowedError extends ApiError {
	constructor() {
		super(
			ReasonPhrases.METHOD_NOT_ALLOWED,
			StatusCodes.METHOD_NOT_ALLOWED,
			AnswerType.Toast
		);
	}
}

class ActionError extends ApiError {
	constructor(mess?: string) {
		super(
			mess ?? ReasonPhrases.METHOD_NOT_ALLOWED,
			StatusCodes.INTERNAL_SERVER_ERROR,
			AnswerType.Toast
		);
	}
}

class UnauthorizedError extends ApiError {
	constructor() {
		super(
			ReasonPhrases.UNAUTHORIZED,
			StatusCodes.UNAUTHORIZED,
			AnswerType.Toast
		);
	}
}

class AccessDeniedError extends ApiError{
	constructor(){
		super(
			'Access Denied',
			StatusCodes.FORBIDDEN,
			AnswerType.Toast,
		)
	}
}

export {
	ApiError,
	ValidateError,
	NotAllowedError,
	ActionError,
  InternalError,
	UnauthorizedError,
	AccessDeniedError,
};
