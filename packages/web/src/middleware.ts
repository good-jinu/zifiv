import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
	const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
	const isLoggedIn = !!req.auth;
	const isAdmin = req.auth?.user?.isAdmin;

	if (isAdminPage) {
		if (!isLoggedIn) {
			const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
			signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
			return NextResponse.redirect(signInUrl);
		}

		if (!isAdmin) {
			return NextResponse.redirect(new URL("/", req.nextUrl.origin));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/admin/:path*"],
};
