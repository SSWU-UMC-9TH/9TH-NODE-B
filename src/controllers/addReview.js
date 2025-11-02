import { StatusCodes } from "http-status-codes";
import { bodyToaddReview } from "../dtos/addReview.dto.js";
import { addStoreReview } from "../services/addReview.service.js";

export const handleAddReview = async (req, res, next) => {
    try {
        const reviewId = await addStoreReview(bodyToaddReview(req.body));
        res.status(StatusCodes.OK).json({result: reviewId});
    } catch (error) {
        next(error); // 에러를 에러 핸들링 미들웨어로 전달
    }
};