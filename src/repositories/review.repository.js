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

// 내가 작성한 리뷰 목록 조회
export const getUserReviews = async (userId, cursor) => {
    const take = 5;
    const where = {
        userId: Number(userId),
        ...(cursor ? { id: { gt: Number(cursor) } } : {}),
    };

    const reviews = await prisma.userStoreReview.findMany({
        where,
        include: {
            store: { select: { id: true, name: true } },
        },
        orderBy: { id: "asc" },
        take,
    });

    const nextCursor = reviews.length > 0 ? reviews[reviews.length - 1].id : null;
    return { reviews, nextCursor };
};