import { prisma } from "../db.config.js";

// 가게 조회
export const getStoreById = async (storeId) => {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
    });
    return store;
};

// 특정 가게 리뷰 작성
export const addReview = async (data) => {
    try {
        const review = await prisma.review.create({
            data: {
                userId: data.userId,
                storeId: data.storeId,
                body: data.body,
                score: data.score,
                createdAt: new Date(),
            },
        });
        return review.id;
    } catch (err) {
        throw new Error(`리뷰 등록 중 오류 발생: ${err.message}`);
    }
};

// 리뷰 이미지 추가
export const addReviewImage = async (data) => {
    try {
        await prisma.reviewImage.create({
            data: {
                reviewId: data.reviewId,
                storeId: data.storeId,
                imageUrl: data.imageUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    } catch (err) {
        throw new Error(`리뷰 이미지 등록 중 오류 발생: ${err.message}`);
    }
};