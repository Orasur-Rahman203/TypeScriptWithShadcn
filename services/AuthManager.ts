import { post } from "@/lib/api/handlers";
import { Response } from "@/types/Response";
import { Token } from "@/types/Token";
import Cookies from "js-cookie";

/**
 * @method revokeTokens
 * @description
 * Only for CLIENT COMPONENTS
 * Revokes the access and refresh tokens.
 */

const revokeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

const refreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    window.location.href = "/auth";
  }

  try {
    const response = await post<Response<Token>>(
      "/auth/token/refresh",
      {
        refresh_token: refreshToken,
      },
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

    if (response.success) {
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);
    }
  } catch {
    window.location.href = "/auth";
  }
};

/**
 * @method AuthManager
 * @description Manage tokens on client components
 * @example
 * AuthManager.revokeTokens() // Removes tokens from cookies on client side
 */

const AuthManager = { revokeTokens, refreshToken };

export default AuthManager;
