import { StatusCodes } from "http-status-codes";
import { bodyToUserMission, responseFromUserMission } from "../dtos/userMission.dto.js";
import { createUserMission } from "../services/userMission.service.js";

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