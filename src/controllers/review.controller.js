import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleCreateReview = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        console.log(`가게(${storeId})에 대한 리뷰 등록 요청:`, req.body);

        // [요청 DTO] body → DB insert용 구조 변환
        const reviewData = bodyToReview(req.body);

        // [Service 호출] 리뷰 등록 및 이미지 추가 처리
        const { review, images } = await createReview(storeId, reviewData);

        // [응답 DTO] DB 결과 → 클라이언트 응답용 변환
        const response = responseFromReview({ review, images });

        res.status(StatusCodes.CREATED).json({ result: response });
    } catch (error) {
        console.error("리뷰 등록 오류:", error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};