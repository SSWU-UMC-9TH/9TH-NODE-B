import { StatusCodes } from "http-status-codes";
import { bodyToaddUserMission } from "../dtos/userMission.dto.js";
import { userMissionUpdate } from "../services/userMission.service.js";

export const handleUserMission = async (req, res, next) => {
    /*
      #swagger.summary = '사용자 미션 추가 API';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                mission_id: { type: "number", example: 1 },
                review_id: { type: "number", example: 0 },
                status: { type: "string", example: "Before starting" },
                progress_count: { type: "number", example: 0 }
              },
              required: ["mission_id"]
            }
          }
        }
      };
      #swagger.responses[200] = {
        description: "사용자 미션 추가 성공 응답",
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
                    id: { type: "number", example: 1 }
                  }
                }
              }
            }
          }
        }
      };
      #swagger.responses[409] = {
        description: "사용자 미션 추가 실패 응답 (이미 도전 중인 미션)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "M002" },
                    reason: { type: "string", example: "이미 도전하고 있는 미션입니다." },
                    data: { type: "object", nullable: true }
                  }
                },
                success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      };
      #swagger.responses[404] = {
        description: "사용자 미션 추가 실패 응답 (미션을 찾을 수 없음)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "M001" },
                    reason: { type: "string", example: "미션을 찾을 수 없습니다." },
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
        // JWT 인증된 사용자 ID 사용 (isLogin 미들웨어를 통해 보장됨)
        const userId = BigInt(req.user.id);
        
        const missionData = {
            ...bodyToaddUserMission(req.body),
            user_id: userId,
        };
        const userMissionId = await userMissionUpdate(missionData);
        res.status(StatusCodes.OK).success(userMissionId);
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};

