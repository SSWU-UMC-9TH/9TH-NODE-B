import { StatusCodes } from "http-status-codes";
import { bodyToMission, responseFromMission } from "../dtos/mission.dto.js";
import { createMission } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        console.log(`가게(${storeId}) 미션 등록 요청:`, req.body);

        const missionData = bodyToMission(req.body);
        const mission = await createMission(storeId, missionData);

        const response = responseFromMission({ mission });
        res.status(StatusCodes.CREATED).json({ result: response });
    } catch (error) {
        console.error("미션 등록 오류:", error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};
