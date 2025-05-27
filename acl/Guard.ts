import { Logger } from "@/server/logger";
import Acl from "./Acl";
import { ROLE, IRoles, IRules, GRANT } from "./types";

// Requires set-value@^2.0.1 !!!
const set = require("set-value");

class Guard {
	private mAcl: Acl;
	private mRoles: IRoles;
	private mRules: IRules;
	private mRole: ROLE;
	private secret?: string;
	public resource?: string;

	constructor(
		roles: IRoles,
		rules: IRules,
		role: ROLE,
		secret?: string,
	) {
		this.mRoles = roles;
		this.mRules = rules;
		this.mRole = role;
		this.secret = secret && secret.length > 0 ? secret : undefined;
		this.mAcl = new Acl(roles, rules, this.secret);
	}

	public get role(): ROLE {
		return this.mRole;
	}
	public get acl(): Acl {
		return this.mAcl;
	}
	public get roles(): IRoles {
		return this.mRoles;
	}
	public get rules(): IRules {
		return this.mRules;
	}

	/**
 * Checks if the given path matches any of the defined routing rules.
 * Supports wildcard '*' in rule definitions and ignores trailing slashes.
 * 
 * @param path - The input path to match against the defined rules.
 * @returns The matched rule string if found, or null if no match is found.
 */
	private isRouteMatch(path: string): string | null {
		// allow to use '/' in end of path
		if (path.length > 1 && path.substring(path.length - 1) === "/") {
			path = path.substring(0, path.length - 1);
		}
		const pParts = path && path.split("/");

		for (const resource in this.rules) {
			if (this.rules.hasOwnProperty(resource)) {
				const rParts = resource.split("/");
				if (rParts.length < pParts.length) continue;
				let result = null;
				for (let i = 0; i < rParts.length; i++) {
					if (!(rParts[i] === pParts[i] || rParts[i] === "*")) {
						result = null;
						break;
					}
					result = resource;
				}
				if (result) {
					return result;
				}
			}
		}
		return null;
	}

	/**
 * Checks if a given resource path is defined in the routing rules.
 * First attempts a direct match, then tries pattern-based matching.
 * 
 * @param resource - The path or resource to check.
 * @returns true if the resource matches a route, false otherwise.
 */
	public inRouter(resource: string) {
		let isRouter = false;
		try {
			if (this.rules.hasOwnProperty(resource)) {
				isRouter = true;
			} else {
				const match = this.isRouteMatch(resource);
				if (match) {
					if (this.rules.hasOwnProperty(match)) {
						isRouter = true;
					}
				}
			}
		} catch (e) {
			isRouter = false;
		}
		return isRouter;
	}

	public allow(
		grant: GRANT,
		resource: string | null = null,
		secret: string | null = null,
		role: ROLE | null = null
	) {
		resource = resource ?? this.resource ?? null;
		secret = secret ?? this.secret ?? null;
		const s = secret ? secret + ":" : "";
		role = role ?? this.role;
		let isAllowed = false;

		Logger.log("allow: ", this.role, resource, grant);

		if(!resource) throw new Error('No Resource in Guard')
		try {
			if (this.rules.hasOwnProperty(resource)) {
				isAllowed = this.acl.isAllowed(s + role, s + resource, grant);
			} else {
				const match = this.isRouteMatch(resource);
				if (match) {
					if (this.rules.hasOwnProperty(match)) {
						isAllowed = this.acl.isAllowed(s + role, s + match, grant);
					}
				}
			}
		} catch (e) {
			Logger.error('allow error', (e as Error).message)
			isAllowed = false;
		}
		return isAllowed;
	}

	// public build(identity: IIdentity) {
	//     const acl = new Acl();
	//     this.init(acl);
	//     if (identity.secret && identity.secret.length > 0) {
	//         this.init(acl, identity.secret);
	//     }
	//     this.acl = acl;
	//     this.identity = identity;
	//     return this;
	// }

	// private init(secret?: string) {
	// 	const s = secret ? secret + ":" : "";
	// 	for (const role in this.roles) {
	// 		if (this.roles.hasOwnProperty(role)) {
	// 			const item = this.roles[role];
	// 			const parentRoleId = item.parent ?? null;
	// 			let parentRole: string[] | string | null = null;
	// 			if (parentRoleId !== null) {
	// 				parentRole = [];
	// 				parentRole = parentRoleId.map((pRole) => s + pRole);
	// 			}
	// 			const pr: string[] | string | null =
	// 				!!secret && role === ROLE.GUEST ? ROLE.GUEST : parentRole;
	// 			this.acl.addRole(s + role, pr);
	// 		}
	// 	}

	// 	for (const resource in this.rules) {
	// 		if (this.rules.hasOwnProperty(resource)) {
	// 			if (!secret) {
	// 				this.acl.addResource(resource);
	// 			} else {
	// 				this.acl.addResource(s + resource, resource);
	// 			}
	// 		}
	// 	}
	// 	for (const resource in this.rules) {
	// 		if (this.rules.hasOwnProperty(resource)) {
	// 			const grant = this.rules[resource];
	// 			const res = s + resource;
	// 			if (grant.hasOwnProperty("allow")) {
	// 				for (const role in grant.allow) {
	// 					if (grant.allow.hasOwnProperty(role)) {
	// 						const grants = grant.allow[role];
	// 						for (let i = 0, size = grants.length; i < size; i++) {
	// 							this.acl.allow(s + role, res, grants[i]);
	// 						}
	// 					}
	// 				}
	// 			}
	// 			if (grant.hasOwnProperty("deny")) {
	// 				for (const role in grant.deny) {
	// 					if (grant.deny.hasOwnProperty(role)) {
	// 						const grants = grant.deny[role];
	// 						for (let i = 0, size = grants.length; i < size; i++) {
	// 							this.acl.deny(s + role, res, grants[i]);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// public getCleanRoles() {
	// 	const result: IRoles = {};
	// 	const roles = this.roles;
	// 	for (const item in roles) {
	// 		if (roles.hasOwnProperty(item)) {
	// 			if (this.role === item || this.acl.inheritsRole(this.role, item)) {
	// 				result[item] = roles[item];
	// 			}
	// 		}
	// 	}
	// 	return result;
	// }

	// public getCleanRules() {
	// 	const result: IRules = {};
	// 	for (const resource in this.rules) {
	// 		if (this.rules.hasOwnProperty(resource)) {
	// 			const grant = this.rules[resource];
	// 			if (grant.hasOwnProperty("allow")) {
	// 				for (const r in grant.allow) {
	// 					if (grant.allow.hasOwnProperty(r)) {
	// 						if (this.role === r || this.acl.inheritsRole(this.role, r)) {
	// 							set(result, `${resource}.allow.${r}`, grant.allow[r]);
	// 						}
	// 					}
	// 				}
	// 			}
	// 			if (grant.hasOwnProperty("deny")) {
	// 				for (const r in grant.deny) {
	// 					if (grant.deny.hasOwnProperty(r)) {
	// 						if (this.role === r || this.acl.inheritsRole(this.role, r)) {
	// 							set(result, `${resource}.deny.${r}`, grant.deny[r]);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return result;
	// }
}

export default Guard;
