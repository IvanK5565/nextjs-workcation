
// import bcrypt from "bcrypt"
import { IRoles, IRules, ROLE } from "@/acl/types";

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }



export const guestRules = (rules: IRules):IRules => Object.fromEntries(
	Object.entries(rules)
		.filter((entry) =>
			Object.hasOwn(entry[1].allow, ROLE.GUEST) && (entry[1].deny ? Object.hasOwn(entry[1].deny, ROLE.GUEST) : true))
		.map(([res, grants]) => {
			return [res, {
				allow: { [ROLE.GUEST]: grants.allow[ROLE.GUEST] },
				deny: grants.deny ? { [ROLE.GUEST]: grants.deny[ROLE.GUEST] } : undefined
			}]
		}))

export const guestRulesNRoles = (rules: IRules, roles:IRoles):{rules:IRules,roles:IRoles} => ({
				roles: { [ROLE.GUEST]: roles[ROLE.GUEST] },
				rules: guestRules(rules),
			})