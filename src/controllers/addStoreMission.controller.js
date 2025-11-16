import { StatusCodes } from "http-status-codes";
import { bodyToaddStoreMission } from "../dtos/addStoreMission.dto.js";
import { storeMissionUpdate } from "../services/addStoreMission.service.js";

export const handleAddStoreMission = async (req, res, next) => {
    /*
      #swagger.summary = '가게 미션 추가 API';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                store_id: { type: "number", example: 1 },
                region_id: { type: "number", example: 1 },
                title: { type: "string", example: "맛집 리뷰 작성하기" },
                is_active: { type: "number", example: 1 },
                point: { type: "number", example: 1000 }
              },
              required: ["store_id", "region_id", "title"]
            }
          }
        }
      };
      #swagger.responses[200] = {
        description: "가게 미션 추가 성공 응답",
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
      #swagger.responses[400] = {
        description: "가게 미션 추가 실패 응답 (유효하지 않은 데이터)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "V001" },
                    reason: { type: "string", example: "요청 데이터가 유효하지 않습니다." },
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
        description: "가게 미션 추가 실패 응답 (가게를 찾을 수 없음)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "S001" },
                    reason: { type: "string", example: "가게가 존재하지 않습니다." },
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
        const addStoreMissionId = await storeMissionUpdate(bodyToaddStoreMission(req.body));
        res.status(StatusCodes.OK).success(addStoreMissionId);
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};