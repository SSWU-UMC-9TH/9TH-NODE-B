import { StatusCodes } from "http-status-codes";
import { bodyToaddStore } from "../dtos/addStore.dto.js";
import { storeUpdate } from "../services/addStore.service.js";

export const handleAddStore = async (req, res, next) => {
    /*
      #swagger.summary = '가게 추가 API';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                region_id: { type: "number", example: 1 },
                name: { type: "string", example: "맛있는 식당" },
                address: { type: "string", example: "서울시 강남구 테헤란로 123" },
                oper_time: { type: "object", example: { "open": "09:00", "close": "22:00" } }
              },
              required: ["region_id", "name", "address"]
            }
          }
        }
      };
      #swagger.responses[200] = {
        description: "가게 추가 성공 응답",
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
        description: "가게 추가 실패 응답 (유효하지 않은 데이터)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "S002" },
                    reason: { type: "string", example: "가게 데이터가 유효하지 않습니다." },
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
        console.log("가게 추가 요청 - req.body:", req.body);
        const dtoResult = bodyToaddStore(req.body);
        console.log("DTO 변환 후:", dtoResult);
        const addStoreId = await storeUpdate(dtoResult);
        res.status(StatusCodes.OK).success(addStoreId);
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};