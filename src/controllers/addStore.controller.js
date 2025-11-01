import { StatusCodes } from "http-status-codes";
import { bodyToaddStore } from "../dtos/addStore.dto.js";
import { storeUpdate } from "../services/addStore.service.js";

export const handleAddStore = async (req, res, next) => {
    try {
        console.log("가게 추가 요청 - req.body:", req.body);
        const dtoResult = bodyToaddStore(req.body);
        console.log("DTO 변환 후:", dtoResult);
        const addStoreId = await storeUpdate(dtoResult);
        res.status(StatusCodes.OK).json({result: addStoreId});
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};