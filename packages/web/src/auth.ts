import { AdminService } from "@zifiv/feeds";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	trustHost: true,
	callbacks: {
		async jwt({ token, user }) {
			if (user?.email) {
				const adminService = new AdminService();
				token.isAdmin = await adminService.isAdmin(user.email);
			}
			return token;
		},
		async session({ session, token }) {
			session.user.isAdmin = !!token.isAdmin;
			return session;
		},
	},
});

declare module "next-auth" {
	interface Session {
		user: {
			isAdmin: boolean;
		} & DefaultSession["user"];
	}
}

import type { DefaultSession } from "next-auth";
