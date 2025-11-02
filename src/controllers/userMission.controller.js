import { StatusCodes } from "http-status-codes";
import { bodyToaddUserMission } from "../dtos/userMission.dto.js";
import { userMissionUpdate } from "../services/userMission.service.js";

export const handleUserMission = async (req, res, next) => {
    try {
        const userMissionId = await userMissionUpdate(bodyToaddUserMission(req.body));
        res.status(StatusCodes.OK).json({result: userMissionId});
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};

