import { NextRequest, NextResponse } from "next/server";
import TokenManager from "./services/TokenManager";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const response = NextResponse.next();

  // Case 1: No tokens present and accessing protected route
  if (!accessToken && !refreshToken && pathname.startsWith("/protected")) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });

    // return NextResponse.redirect(new URL("/auth?msg=login+required", req.url));
  }

  // Case 2: accessToken exists but no refreshToken
  if (accessToken && !refreshToken) {
    const isValid = await TokenManager.validateToken(accessToken);
    if (!isValid) {
      response.cookies.set("accessToken", "", { maxAge: 0 });
      response.cookies.set("refreshToken", "", { maxAge: 0 });
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // Case 3: refreshToken exists but no accessToken
  if (!accessToken && refreshToken) {
    const newTokens = await TokenManager.refreshAccessToken(refreshToken);
    if (newTokens) {
      response.cookies.set("accessToken", newTokens.accessToken, {
        maxAge:
          new Date(newTokens.accessTokenExpiresAt!).getTime() - Date.now(),
      });
      response.cookies.set("refreshToken", newTokens.refreshToken, {
        maxAge:
          new Date(newTokens.refreshTokenExpiresAt!).getTime() - Date.now(),
      });
      return response;
    } else {
      response.cookies.set("accessToken", "", { maxAge: 0 });
      response.cookies.set("refreshToken", "", { maxAge: 0 });
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // Case 4: Both tokens exist and trying to visit the /auth page
  if (accessToken && refreshToken && pathname === "/auth") {
    return NextResponse.redirect(new URL("/protected", req.url)); // Redirect to dashboard
  }

  // Case 5: Validate tokens for normal operations
  if (accessToken && refreshToken) {
    const isValid = await TokenManager.validateToken(accessToken);
    if (!isValid) {
      const newTokens = await TokenManager.refreshAccessToken(refreshToken);
      if (newTokens) {
        response.cookies.set("accessToken", newTokens.accessToken, {
          maxAge:
            new Date(newTokens.accessTokenExpiresAt!).getTime() - Date.now(),
        });
        response.cookies.set("refreshToken", newTokens.refreshToken, {
          maxAge:
            new Date(newTokens.refreshTokenExpiresAt!).getTime() - Date.now(),
        });
        return response;
      } else {
        response.cookies.set("accessToken", "", { maxAge: 0 });
        response.cookies.set("refreshToken", "", { maxAge: 0 });
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    }
  }

  // Default: Proceed for all non-protected routes
  return NextResponse.next();
}

// Matcher for defining which routes this middleware should apply to
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude some common routes like API and static files
    "/auth", // Apply middleware logic to /auth as well
    "/protected/:path*", // Protect routes under /protected
  ],
};
