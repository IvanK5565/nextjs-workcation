import type { Middleware } from "@/types";
import container from "@/server/container";
import { ValidateError } from "@/server/exceptions";

function validateIt(value: object, schema: object) {
	console.log("schema ", schema, "value ", value);
	const ajv = container.resolve("ajv");
	const validate = ajv.compile(schema);
	return validate(value);
}

export function validate(
	schema: object,
	target: "body" | "query"
): Middleware {
	return (req, res, next) => {
		const valid = validateIt(req[target], schema);
		if (!valid) throw new ValidateError();
		return next();
	};
}