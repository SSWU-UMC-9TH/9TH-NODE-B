import { StatusCodes } from "http-status-codes";
import { bodyToMission, responseFromMission, ListStoreMissionsRequestDto, MissionListResponseDto } from "../dtos/mission.dto.js";
import { createMission, listStoreMissions } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
    /*
    #swagger.summary = '미션 등록 API';
    #swagger.parameters['storeId'] = {
        in: 'path',
        description: '가게 ID',
        required: true,
        type: 'integer'
    }

    #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                reward: { type: "number" },
                deadline: { type: "string", format: "date-time" },
                missionSpec: { type: "string" }
            }
            }
        }
        }
    }

    #swagger.responses[201] = {
        description: "미션 등록 성공",
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
                    store_id: { type: "number" },
                    reward: { type: "number" },
                    deadline: { type: "string", format: "date-time" },
                    mission_spec: { type: "string" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
                }
            }
            }
        }
        }
    }

    #swagger.responses[404] = {
        description: "존재하지 않는 가게 ID",
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
        const { storeId } = req.params;
        console.log(`가게(${storeId}) 미션 등록 요청:`, req.body);

        const missionData = bodyToMission(req.body);
        const mission = await createMission(storeId, missionData);

        const response = responseFromMission({ mission });
        res.status(StatusCodes.CREATED);
        res.success(response);
    } catch (error) {
        next(error);
    }
};

// 특정 가게의 미션 목록 조회
export const handleListStoreMissions = async (req, res, next) => {
    /*
    #swagger.summary = '가게별 미션 목록 조회';
    #swagger.parameters['storeId'] = {
        in: 'path',
        description: '가게 ID',
        required: true,
        type: 'integer'
    }

    #swagger.responses[200] = {
        description: "미션 목록 조회 성공",
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
                    storeId: { type: "number" },
                    reward: { type: "number" },
                    deadline: { type: "string", format: "date-time" },
                    missionSpec: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
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

    #swagger.responses[404] = {
        description: "존재하지 않는 가게 ID",
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
        const requestDto = new ListStoreMissionsRequestDto(req.params);
        const missions = await listStoreMissions(requestDto.storeId);
        const responseDto = new MissionListResponseDto(missions);

        res.status(StatusCodes.OK);
        res.success(responseDto);
    } catch (err) {
        next(err);
    }
};