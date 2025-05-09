import Guard from "@/acl/Guard";
import { IIdentity } from "@/acl/types";
import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		acl?: any;
		accessToken:any;
		user:IIdentity;
		guard?:Guard;
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		acl?: any;
		user:IIdentity;
	}
}
