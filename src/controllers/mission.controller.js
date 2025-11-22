import { StatusCodes } from "http-status-codes";
import { listStoreMissions, listMyMissions } from "../services/mission.service.js";

// 특정 가게의 미션 목록
export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '특정 가게의 미션 목록 조회 API';
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
      description: '페이지네이션 커서 (마지막 미션 ID)'
    };
    #swagger.responses[200] = {
      description: "특정 가게의 미션 목록 조회 성공 응답",
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
                        title: { type: "string", example: "맛집 리뷰 작성하기" },
                        point: { type: "number", example: 1000 },
                        isActive: { type: "number", example: 1 },
                        startedAt: { type: "string", format: "date-time", nullable: true },
                        endAt: { type: "string", format: "date-time", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
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

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};

// 내가 진행 중인 미션 목록
export const handleListMyMissions = async (req, res, next) => {
  /*
    #swagger.summary = '내가 진행 중인 미션 목록 조회 API';
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
      description: '페이지네이션 커서 (마지막 미션 ID)'
    };
    #swagger.responses[200] = {
      description: "내가 진행 중인 미션 목록 조회 성공 응답",
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
                        status: { type: "string", example: "Before starting" },
                        progressCount: { type: "number", example: 0 },
                        createdAt: { type: "string", format: "date-time" },
                        mission: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            title: { type: "string", example: "맛집 리뷰 작성하기" },
                            point: { type: "number", example: 1000 },
                            isActive: { type: "number", example: 1 },
                            startedAt: { type: "string", format: "date-time", nullable: true },
                            endAt: { type: "string", format: "date-time", nullable: true },
                            store: {
                              type: "object",
                              properties: {
                                id: { type: "number", example: 1 },
                                name: { type: "string", example: "맛있는 식당" }
                              }
                            }
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
    // 본인만 조회 가능하도록 검증
    const requestedUserId = BigInt(req.params.userId);
    const authenticatedUserId = req.user ? BigInt(req.user.id) : null;

    if (!authenticatedUserId || requestedUserId !== authenticatedUserId) {
      return res.status(403).error({
        errorCode: "FORBIDDEN",
        reason: "본인의 미션만 조회할 수 있습니다.",
        data: null,
      });
    }

    const userId = parseInt(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const missions = await listMyMissions(userId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};

