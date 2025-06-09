/* eslint-disable @typescript-eslint/no-explicit-any */
import { IIdentity, IRoles, IRules } from "@/acl/types";

declare module "next-auth" {
	interface Session {
		acl?: {roles:IRoles, rules:IRules};
		accessToken:any;
		user:IIdentity;
		roles?:IRoles;
		rules?:IRules;
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		acl?: {roles:IRoles, rules:IRules};
		user:IIdentity;
	}
}
