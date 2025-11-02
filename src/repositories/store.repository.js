import { prisma } from "../db.config.js";

// 지역 존재 여부 확인
export const getRegionById = async (regionId) => {
    const region = await prisma.region.findUnique({
        where: { id: regionId },
    });
    return region;
};

// 가게 추가
export const addStore = async (data) => {
    try {
        const store = await prisma.store.create({
            data: {
                regionId: data.regionId,
                name: data.name,
                address: data.address,
                score: data.score,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return store.id;
    } catch (err) {
        throw new Error(`가게 등록 중 오류 발생: ${err.message}`);
    }
};
// 리뷰 목록 조회
export const getAllStoreReviews = async (storeId, cursor) => {
    const reviews = await prisma.userStoreReview.findMany({
        select: { id: true, content: true, store: true, user: true },
        where: { storeId: storeId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
};