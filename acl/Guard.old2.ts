import Acl from "./Acl";
import { ROLE, IRoles, IRules, IIdentity, GRANT } from "./types";

// Requires set-value@^2.0.1 !!!
const set = require("set-value");

class Guard {
	private mAcl: Acl;
	private mRoles: IRoles;
	private mRules: IRules;
	private mRole: ROLE;
	private secret?: string;
	private resource: string;

	constructor(
		roles: IRoles,
		rules: IRules,
		identity: {role:ROLE, secret?:string},
		resource: string
	) {
		this.mAcl = new Acl();
		this.mRoles = roles;
		this.mRules = rules;

		this.init();
		if (identity.secret && identity.secret.length > 0) {
			this.init(identity.secret);
		}
		this.mRole = identity.role;
		this.secret = identity.secret;
		this.resource = resource;
	}

	public get role(): ROLE {
		return this.mRole;
	}
	public get acl(): Acl{
		return this.mAcl;
	};
	public get roles(): IRoles{
		return this.mRoles;
	};
	public get rules(): IRules{
		return this.mRules;
	};

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

	public getAllow(
		resource: string,
		secret: string | null = null,
		role: ROLE | null = null
	) {
		return (grant: GRANT) => this.allow(grant, resource, secret, role);
	}

	public allow(
		grant: GRANT,
		resource: string | null = null,
		secret: string | null = null,
		role: ROLE | null = null
	) {
		resource = resource ?? this.resource ?? null;
		secret = secret ?? this.secret ?? null;
		role = role ?? this.role;

		console.log('allow: ', this.role, resource, grant)

		const s = secret ? secret + ":" : "";
		let isAllowed = false;
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

	private buildAcl(roles:IRoles, rules:IRules, secret?: string){
		const acl = new Acl();
		const s = secret ? secret + ":" : "";
		for (const role in roles) {
			if (!roles.hasOwnProperty(role)) continue;
			const item = roles[role];
			const parentRoleId = item.parent ?? null;
			let parentRole: string[] | string | null = null;
			if (parentRoleId !== null) {
				parentRole = [];
				parentRole = parentRoleId.map((pRole) => s + pRole);
			}
			const pr: string[] | string | null =
				!!secret && role === ROLE.GUEST ? ROLE.GUEST : parentRole;
			acl.addRole(s + role, pr);
		}
		for (const resource in rules) {
			if (!rules.hasOwnProperty(resource)) continue;
			if (!secret) {
				acl.addResource(resource);
			} else {
				acl.addResource(s + resource, resource);
			}
		}
		for (const resource in rules) {
			if (rules.hasOwnProperty(resource)) continue;
			const grant = rules[resource];
			const res = s + resource;
			if (!grant.hasOwnProperty("allow")) continue;
			for (const role in grant.allow) {
				if (grant.allow.hasOwnProperty(role)) {
					const grants = grant.allow[role];
					for (let i = 0, size = grants.length; i < size; i++) {
						acl.allow(s + role, res, grants[i]);
					}
				}
			}
			if (!grant.hasOwnProperty("deny")) continue;
			for (const role in grant.deny) {
				if (grant.deny.hasOwnProperty(role)) {
					const grants = grant.deny[role];
					for (let i = 0, size = grants.length; i < size; i++) {
						acl.deny(s + role, res, grants[i]);
					}
				}
			}
		}
		return acl;
	}

	private init(secret?: string) {
		const s = secret ? secret + ":" : "";
		for (const role in this.roles) {
			if (this.roles.hasOwnProperty(role)) {
				const item = this.roles[role];
				const parentRoleId = item.parent ?? null;
				let parentRole: string[] | string | null = null;
				if (parentRoleId !== null) {
					parentRole = [];
					parentRole = parentRoleId.map((pRole) => s + pRole);
				}
				const pr: string[] | string | null =
					!!secret && role === ROLE.GUEST ? ROLE.GUEST : parentRole;
				this.acl.addRole(s + role, pr);
			}
		}

		for (const resource in this.rules) {
			if (this.rules.hasOwnProperty(resource)) {
				if (!secret) {
					this.acl.addResource(resource);
				} else {
					this.acl.addResource(s + resource, resource);
				}
			}
		}
		for (const resource in this.rules) {
			if (this.rules.hasOwnProperty(resource)) {
				const grant = this.rules[resource];
				const res = s + resource;
				if (grant.hasOwnProperty("allow")) {
					for (const role in grant.allow) {
						if (grant.allow.hasOwnProperty(role)) {
							const grants = grant.allow[role];
							for (let i = 0, size = grants.length; i < size; i++) {
								this.acl.allow(s + role, res, grants[i]);
							}
						}
					}
				}
				if (grant.hasOwnProperty("deny")) {
					for (const role in grant.deny) {
						if (grant.deny.hasOwnProperty(role)) {
							const grants = grant.deny[role];
							for (let i = 0, size = grants.length; i < size; i++) {
								this.acl.deny(s + role, res, grants[i]);
							}
						}
					}
				}
			}
		}
	}

	public getCleanRoles() {
		const result: IRoles = {};
		const roles = this.roles;
		for (const item in roles) {
			if (roles.hasOwnProperty(item)) {
				if (this.role === item || this.acl.inheritsRole(this.role, item)) {
					result[item] = roles[item];
				}
			}
		}
		return result;
	}

	public getCleanRules() {
		const result: IRules = {};
		for (const resource in this.rules) {
			if (this.rules.hasOwnProperty(resource)) {
				const grant = this.rules[resource];
				if (grant.hasOwnProperty("allow")) {
					for (const r in grant.allow) {
						if (grant.allow.hasOwnProperty(r)) {
							if (this.role === r || this.acl.inheritsRole(this.role, r)) {
								set(result, `${resource}.allow.${r}`, grant.allow[r]);
							}
						}
					}
				}
				if (grant.hasOwnProperty("deny")) {
					for (const r in grant.deny) {
						if (grant.deny.hasOwnProperty(r)) {
							if (this.role === r || this.acl.inheritsRole(this.role, r)) {
								set(result, `${resource}.deny.${r}`, grant.deny[r]);
							}
						}
					}
				}
			}
		}
		return result;
	}
}

export default Guard;
