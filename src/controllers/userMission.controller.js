import { StatusCodes } from "http-status-codes";
import {
    bodyToUserMission, responseFromUserMission,
    ListUserActiveMissionsRequestDto, UserActiveMissionListResponseDto,
} from "../dtos/userMission.dto.js";
import { createUserMission, listUserActiveMissions } from "../services/userMission.service.js";

export const handleUserMissionChallenge = async (req, res, next) => {
    try {
        const { storeId, missionId } = req.params;
        console.log(`가게(${storeId}) 미션(${missionId}) 도전 요청:`, req.body);

        const userMissionData = bodyToUserMission(req.body);
        const userMission = await createUserMission(storeId, missionId, userMissionData);

        const response = responseFromUserMission({ userMission });
        res.status(StatusCodes.CREATED).json({ result: response });
    } catch (error) {
        next(error);
    }
};

// 내가 진행 중인 미션 목록
export const handleListUserActiveMissions = async (req, res, next) => {
    try {
        const requestDto = new ListUserActiveMissionsRequestDto(req.params);
        const missions = await listUserActiveMissions(requestDto.userId);
        const responseDto = new UserActiveMissionListResponseDto(missions);

        res.status(StatusCodes.OK).json({
            success: true,
            data: responseDto,
        });
    } catch (err) {
        next(err);
    }
};