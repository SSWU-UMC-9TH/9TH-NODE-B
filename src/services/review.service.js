import { addReview, addReviewImage, getStoreById } from "../repositories/review.repository.js";

export const createReview = async (storeId, data) => {
    const { userId, body, score, images } = data;

    // store 존재 여부 확인
    const store = await getStoreById(storeId);
    if (!store) throw new Error(`존재하지 않는 가게 ID입니다: ${storeId}`);

    // 리뷰 등록
    const reviewId = await addReview({ userId, storeId, body, score });

    // 이미지 등록 (선택)
    if (images && images.length > 0) {
        for (const imageUrl of images) {
            await addReviewImage({ reviewId, storeId, imageUrl });
        }
    }

    // 응답용 데이터
    return {
        review: {
            id: reviewId,
            store_id: storeId,
            user_id: userId,
            body,
            score,
            created_at: new Date()
        },
        images: images?.map((url, idx) => ({
            id: idx + 1,
            image_url: url,
            created_at: new Date()
        })) || []
    };
};