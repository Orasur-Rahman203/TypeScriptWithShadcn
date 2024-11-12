import { get, post } from "@/lib/api/handlers";
import { Response } from "@/types/Response";
import { Token } from "@/types/Token";
import { cookies } from "next/headers";

/**
 * @class TokenManager
 * @description A server side cookie management class.
 * Use methods of this class on the server actions, middlewares.
 */

class TokenManager {
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await get<Response<{ isValid: boolean }>>(
        "/auth/token",
        { Authorization: `Bearer ${accessToken}` }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<Token | null> {
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
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  }

  static checkTokens(): Token | null {
    let accessToken = cookies().get("accessToken")?.value;
    let refreshToken = cookies().get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return null;
    } else {
      let tokens: Token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return tokens;
    }
  }
  static revokeTokens() {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  }
}

export default TokenManager;
