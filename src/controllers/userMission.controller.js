import { StatusCodes } from "http-status-codes";
import {
    bodyToUserMission, responseFromUserMission,
    ListUserActiveMissionsRequestDto, UserActiveMissionListResponseDto,
} from "../dtos/userMission.dto.js";
import { createUserMission, listUserActiveMissions } from "../services/userMission.service.js";

export const handleUserMissionChallenge = async (req, res, next) => {
    /*
    #swagger.summary = '유저 미션 도전 API';
    #swagger.parameters['storeId'] = {
        in: 'path',
        description: '가게 ID',
        required: true,
        type: 'integer'
    };

    #swagger.parameters['missionId'] = {
        in: 'path',
        description: '미션 ID',
        required: true,
        type: 'integer'
    };

    #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                userId: { type: "number" }
            },
            required: ["userId"]
            }
        }
        }
    };

    #swagger.responses[201] = {
        description: "유저 미션 도전 성공",
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
                    user_id: { type: "number" },
                    mission_id: { type: "number" },
                    status: { type: "string" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
                }
            }
            }
        }
        }
    };

    #swagger.responses[404] = {
        description: "가게 또는 미션이 존재하지 않음",
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
    };

    #swagger.responses[400] = {
        description: "이미 도전 중인 미션",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                type: "object",
                properties: {
                    errorCode: { type: "string", example: "E400" },
                    reason: { type: "string" },
                    data: { type: "object", nullable: true }
                }
                },
                success: { type: "object", nullable: true }
            }
            }
        }
        }
    };
    */
    try {
        const userId = req.user.id;   // JWT 인증된 사용자
        const userMissionData = { userId };
        const userMission = await createUserMission(storeId, missionId, userMissionData);

        const response = responseFromUserMission({ userMission });
        res.status(StatusCodes.CREATED);
        res.status(response);
    } catch (error) {
        next(error);
    }
};

// 내가 진행 중인 미션 목록
export const handleListUserActiveMissions = async (req, res, next) => {
    /*
    #swagger.summary = '유저가 진행 중인 미션 목록 조회 API';
    #swagger.parameters['userId'] = {
        in: 'path',
        description: '유저 ID',
        required: true,
        type: 'integer'
    };

    #swagger.responses[200] = {
        description: "진행 중인 미션 목록 조회 성공",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                    id: { type: "number" },
                    missionId: { type: "number" },
                    status: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    mission: {
                        type: "object",
                        properties: {
                        id: { type: "number" },
                        reward: { type: "number" },
                        deadline: { type: "string", format: "date-time" },
                        missionSpec: { type: "string" },
                        store: {
                            type: "object",
                            properties: {
                            id: { type: "number" },
                            name: { type: "string" }
                            }
                        }
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

    #swagger.responses[500] = {
        description: "서버 내부 오류",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                type: "object",
                properties: {
                    errorCode: { type: "string", example: "E500" },
                    reason: { type: "string" },
                    data: { type: "object", nullable: true }
                }
                },
                success: { type: "object", nullable: true }
            }
            }
        }
        }
    };
    */
    try {
        const userId = req.user.id;
        const missions = await listUserActiveMissions(userId);
        const responseDto = new UserActiveMissionListResponseDto(missions);

        res.status(StatusCodes.OK);
        res.status(responseDto);
    } catch (err) {
        next(err);
    }
};