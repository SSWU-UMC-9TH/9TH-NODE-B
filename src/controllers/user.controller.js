import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUserUpdate } from "../dtos/user.dto.js";
import { userSignUp, updateUserInfo } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.description = '새로운 사용자를 등록하거나, 이미 존재하는 이메일의 경우 정보를 업데이트합니다.';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "test@example.com" },
              password: { type: "string", example: "password123" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "남성" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              preferences: { type: "array", items: { type: "number" }, example: [1, 2] },
              agree: { type: "number", example: 1 },
              status: { type: "string", example: "Active" },
              point: { type: "number", example: 0 }
            },
            required: ["email", "name"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
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
                  id: { type: "number", example: 1 },
                  email: { type: "string", example: "test@example.com" },
                  name: { type: "string", example: "홍길동" },
                  gender: { type: "string", example: "남성" },
                  birth: { type: "string", format: "date-time" },
                  address: { type: "string", example: "서울시 강남구" },
                  status: { type: "string", example: "Active" },
                  inactiveDate: { type: "string", format: "date-time", nullable: true },
                  phoneNumber: { type: "string", example: "010-1234-5678" },
                  point: { type: "number", example: 0 },
                  preferences: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        categoryId: { type: "number", example: 1 },
                        name: { type: "string", example: "한식" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답 (비밀번호 규칙 위반)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string", example: "비밀번호는 8자 이상이어야 합니다." },
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
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (error) {
    next(error); // 에러를 에러 핸들링 미들웨어로 전달
  }
};

export const handleUpdateUserInfo = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 정보 수정 API';
    #swagger.description = '로그인한 사용자의 정보를 수정합니다.';
    #swagger.security = [{
      "bearerAuth": []
    }];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "남성" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              password: { type: "string", example: "newpassword123" },
              agree: { type: "number", example: 1 },
              status: { type: "string", example: "Active" },
              point: { type: "number", example: 0 }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "사용자 정보 수정 성공 응답",
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
                  id: { type: "number", example: 1 },
                  email: { type: "string", example: "test@example.com" },
                  name: { type: "string", example: "홍길동" },
                  gender: { type: "string", example: "남성" },
                  birth: { type: "string", format: "date-time" },
                  address: { type: "string", example: "서울시 강남구" },
                  status: { type: "string", example: "Active" },
                  inactiveDate: { type: "string", format: "date-time", nullable: true },
                  phoneNumber: { type: "string", example: "010-1234-5678" },
                  point: { type: "number", example: 0 },
                  preferences: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        categoryId: { type: "number", example: 1 },
                        name: { type: "string", example: "한식" }
                      }
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
      description: "인증 실패",
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
                  reason: { type: "string", example: "로그인이 필요합니다." },
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
  try {
    if (!req.user) {
      return res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "로그인이 필요합니다.",
        data: null,
      });
    }

    const userId = BigInt(req.user.id);
    const user = await updateUserInfo(userId, bodyToUserUpdate(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (error) {
    next(error);
  }
};
