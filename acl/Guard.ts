import { Logger } from "@/server/logger";
import Acl from "./Acl";
import { ROLE, IRoles, IRules, GRANT } from "./types";

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
			Logger.error((e as Error).message)
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
		const s = secret || this.secret ? (secret ?? this.secret) + ":" : "";
		role = role ?? this.role;
		let isAllowed = false;

		if(!resource) throw new Error('No Resource in Guard')
		try {
			if (this.rules.hasOwnProperty(resource)) {
				isAllowed = this.acl.isAllowed(s + role, s + resource, grant);
			} else {
				const match = this.isRouteMatch(resource);
				if (match) {
					Logger.log('match', match)
					if (this.rules.hasOwnProperty(match)) {
						isAllowed = this.acl.isAllowed(s + role, s + match, grant);
					}
				}
			}
		} catch (e) {
			Logger.error('allow error', (e as Error).message)
			isAllowed = false;
		}
		Logger.log("allow: ", this.role, resource, grant, ':',isAllowed);

		return isAllowed;
	}
}

export default Guard;
