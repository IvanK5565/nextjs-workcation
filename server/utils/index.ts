
// import bcrypt from "bcrypt"
import { IRules, ROLE } from "@/acl/types";

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }



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