import { StatusCodes } from "http-status-codes";
import { bodyToMission, responseFromMission, ListStoreMissionsRequestDto, MissionListResponseDto } from "../dtos/mission.dto.js";
import { createMission, listStoreMissions } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
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