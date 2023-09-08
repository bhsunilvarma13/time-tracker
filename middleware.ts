export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/track/:path*",
    "/clients/:path*",
    "/projects/:path*",
  ],
};
