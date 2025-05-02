import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		acl?: any;
		accessToken:any;
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		acl?: any;
	}
}
