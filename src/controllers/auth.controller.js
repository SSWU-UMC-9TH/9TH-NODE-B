import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "../auth.config.js";

export const handleLogin = async (req, res, next) => {
  /*
    #swagger.summary = '이메일/비밀번호 로그인 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "test@example.com" },
              password: { type: "string", example: "password123" }
            },
            required: ["email", "password"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "로그인 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  message: { type: "string", example: "로그인 성공!" },
                  tokens: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string", example: "eyJhbGci..." },
                      refreshToken: { type: "string", example: "eyJhbGci..." }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "로그인 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UNAUTHORIZED" },
                  reason: { type: "string", example: "이메일 또는 비밀번호가 올바르지 않습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error("로그인 에러:", err);
      return res.status(500).error({
        errorCode: "LOGIN_ERROR",
        reason: err.message || "로그인 중 오류가 발생했습니다.",
        data: null,
      });
    }

    if (!user) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: info?.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
        data: null,
      });
    }

    // JWT 토큰 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(StatusCodes.OK).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "로그인 성공!",
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  })(req, res, next);
};

