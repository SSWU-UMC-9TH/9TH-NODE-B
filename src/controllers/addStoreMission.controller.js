import { StatusCodes } from "http-status-codes";
import { bodyToaddStoreMission } from "../dtos/addStoreMission.dto.js";
import { storeMissionUpdate } from "../services/addStoreMission.service.js";

export const handleAddStoreMission = async (req, res, next) => {
    try {
        const addStoreMissionId = await storeMissionUpdate(bodyToaddStoreMission(req.body));
        res.status(StatusCodes.OK).json({result: addStoreMissionId});
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};