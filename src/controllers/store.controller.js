import { StatusCodes } from "http-status-codes";
import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

export const handleCreateStore = async (req, res, next) => {
    try {
        console.log("가게 등록 요청:", req.body);

        // [요청 DTO] body → service 처리용 형태로 변환
        const storeData = bodyToStore(req.body);

        // [Service 호출] DB에 가게 등록
        const store = await createStore(storeData);

        // [응답 DTO] DB 결과 → 클라이언트 응답용 변환
        const response = responseFromStore({ store });

        res.status(StatusCodes.CREATED).json({ result: response });
    } catch (error) {
        console.error("가게 등록 오류:", error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};