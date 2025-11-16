import { StatusCodes } from "http-status-codes";
import { listStoreReviews, listMyReviews } from "../services/review.service.js";

export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      type: 'number',
      description: '가게 ID'
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      type: 'number',
      description: '페이지네이션 커서 (마지막 리뷰 ID)'
    };
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
                        id: { type: "number", example: 1 },
                        content: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 5 },
                        createdAt: { type: "string", format: "date-time" },
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "홍길동" }
                          }
                        },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "맛있는 식당" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 5 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).success(reviews);
  } catch (error) {
    next(error);
  }
};

export const handleListMyReviews = async (req, res, next) => {
  /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회 API';
    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'number',
      description: '사용자 ID'
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      type: 'number',
      description: '페이지네이션 커서 (마지막 리뷰 ID)'
    };
    #swagger.responses[200] = {
      description: "내가 작성한 리뷰 목록 조회 성공 응답",
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
                        id: { type: "number", example: 1 },
                        content: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 5 },
                        createdAt: { type: "string", format: "date-time" },
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "홍길동" }
                          }
                        },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "맛있는 식당" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 5 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const userId = parseInt(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const reviews = await listMyReviews(userId, cursor);
    res.status(StatusCodes.OK).success(reviews);
  } catch (error) {
    next(error);
  }
};

