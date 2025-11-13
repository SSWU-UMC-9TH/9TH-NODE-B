import { StatusCodes } from "http-status-codes";
import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";
import { createStore, listStoreReviews } from "../services/store.service.js";

export const handleCreateStore = async (req, res, next) => {
  /*
  #swagger.summary = '가게 등록 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            regionId: { type: "number" },
            name: { type: "string" },
            address: { type: "string" },
            score: { type: "number" }
          },
          required: ["regionId", "name"]
        }
      }
    }
  }

  #swagger.responses[201] = {
    description: "가게 등록 성공",
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
                id: { type: "number" },
                regionId: { type: "number" },
                name: { type: "string" },
                address: { type: "string" },
                score: { type: "number" }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "존재하지 않는 지역 ID",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "E404" },
                reason: { type: "string" },
                data: { type: "object", nullable: true }
              }
            },
            success: { type: "object", nullable: true }
          }
        }
      }
    }
  }
*/
  try {
    console.log("가게 등록 요청:", req.body);

    // [요청 DTO] body → service 처리용 형태로 변환
    const storeData = bodyToStore(req.body);

    // [Service 호출] DB에 가게 등록
    const store = await createStore(storeData);

    // [응답 DTO] DB 결과 → 클라이언트 응답용 변환
    const response = responseFromStore({ store });

    res.status(StatusCodes.CREATED);
    res.success(response);
  } catch (error) {
    next(error);
  }
};

// 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  /*
  #swagger.summary = '상점 리뷰 목록 조회 API';
  #swagger.responses[200] = {
    description: "상점 리뷰 목록 조회 성공 응답",
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
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                      user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                      content: { type: "string" }
                    }
                  }
                },
                pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
              }
            }
          }
        }
      }
    }
  };
*/
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK);
  res.success(reviews);
};