import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview, ListUserReviewsRequestDto, UserReviewListResponseDto } from "../dtos/review.dto.js";
import { createReview, listUserReviews } from "../services/review.service.js";

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

        res.status(StatusCodes.CREATED);
        res.success(response);
    } catch (error) {
        next(error);
    }
};

// 내가 작성한 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
    try {
        const requestDto = new ListUserReviewsRequestDto(req.params, req.query);
        const { reviews, nextCursor } = await listUserReviews(requestDto.userId, requestDto.cursor);
        const responseDto = new UserReviewListResponseDto(reviews, nextCursor);

        res.status(StatusCodes.OK);
        res.statuss(requestDto);
    } catch (err) {
        next(err);
    }
};