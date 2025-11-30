import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import passport from "passport";

export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
            gender: { type: "string" },
            birth: { type: "string", format: "date" },
            address: { type: "string" },
            detailAddress: { type: "string" },
            phoneNumber: { type: "string" },
            preferences: { type: "array", items: { type: "number" } }
          }
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
                email: { type: "string" },
                name: { type: "string" },
                preferCategory: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "회원 가입 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
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
    console.log("회원가입 요청");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body));

    return res.status(StatusCodes.OK).success(user);
  } catch (err) {
    console.error("회원가입 처리 중 오류:", err);
    next(err);
  }
};

// [추가] 로그인 API
export const handleUserLogin = (req, res, next) => {
  /*
  #swagger.summary = '로그인 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", example: "test@gmail.com" },
            password: { type: "string", example: "password1234" }
          }
        }
      }
    }
  };
  */
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("로그인 에러:", err);
      return next(err);
    }

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        resultType: "FAIL",
        error: {
          errorCode: "A001",
          reason: info.message || "로그인 실패"
        }
      });
    }

    // Passport 세션 로그인 처리
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // 로그인 성공 응답
      return res.status(StatusCodes.OK).json({
        resultType: "SUCCESS",
        success: {
          email: user.email,
          name: user.name,
          message: "로그인 성공"
        }
      });
    });
  })(req, res, next);
};

// 유저 정보 수정 API
export const handleUpdateMyInfo = async (req, res, next) => {
  /*
    #swagger.summary = '내 정보 수정 API (Google 로그인 후 정보 업데이트)';
    #swagger.tags = ['Users']
    #swagger.security = [{ "BearerAuth": [] }]
    #swagger.description = `
        Google 로그인으로 생성된 기본값(추후 수정) 등을 
        사용자가 직접 수정할 수 있는 API입니다.  
        JWT 인증이 필요합니다.
    `

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "female" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "101동 1203호" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              preferences: {
                type: "array",
                items: { type: "number" },
                example: [1, 3, 5]
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "업데이트 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "null", example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string", example: "test@gmail.com" },
                  name: { type: "string", example: "홍길동" },
                  preferCategory: {
                    type: "array",
                    items: { type: "string" },
                    example: ["한식", "패스트푸드"]
                  }
                }
              }
            }
          }
        }
      }
    };

    #swagger.responses[400] = { 
      description: "잘못된 요청",
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
                   reason: { type: "string", example: "유효하지 않은 입력값" }
                 }
               },
               success: { type: "null", example: null }
             }
           }
        }
      }
    };
    */
  try {
    const userId = req.user.id;
    const updated = await updateMyInfo(userId, req.body);

    return res.status(StatusCodes.OK).success(updated);
  } catch (err) {
    next(err);
  }
};
