import { StatusCodes } from "http-status-codes";
import { bodyToaddReview } from "../dtos/addReview.dto.js";
import { addStoreReview } from "../services/addReview.service.js";

export const handleAddReview = async (req, res, next) => {
    /*
      #swagger.summary = '리뷰 추가 API';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                store_id: { type: "number", example: 1 },
                user_mission_id: { type: "number", example: 0 },
                review_image_id: { type: "number", example: 0 },
                content: { type: "string", example: "맛있어요!" },
                score: { type: "number", example: 5 }
              },
              required: ["store_id", "content", "score"]
            }
          }
        }
      };
      #swagger.responses[200] = {
        description: "리뷰 추가 성공 응답",
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
      #swagger.responses[404] = {
        description: "리뷰 추가 실패 응답 (가게를 찾을 수 없음)",
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
        // JWT 인증된 사용자 ID 사용 (isLogin 미들웨어를 통해 보장됨)
        const userId = BigInt(req.user.id);
        
        const reviewData = {
            ...bodyToaddReview(req.body),
            user_id: userId,
        };
        const reviewId = await addStoreReview(reviewData);
        res.status(StatusCodes.OK).success(reviewId);
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};