import { prisma } from "../db.config.js";

// 가게의 모든 리뷰 조회 (cursor 기반 페이지네이션)
export const getAllStoreReviews = async (storeId, cursor = 0) => {
  const whereCondition = {
    storeId: BigInt(storeId),
  };

  // cursor가 0보다 크면 해당 cursor보다 큰 id만 조회
  if (cursor > 0) {
    whereCondition.id = { gt: BigInt(cursor) };
  }

  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      score: true,
      createdAt: true,
      storeId: true,
      userId: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: whereCondition,
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};

// 내가 작성한 리뷰 목록 조회 (cursor 기반 페이지네이션)
export const getMyReviews = async (userId, cursor = 0) => {
  const whereCondition = {
    userId: BigInt(userId),
  };

  // cursor가 0보다 크면 해당 cursor보다 큰 id만 조회
  if (cursor > 0) {
    whereCondition.id = { gt: BigInt(cursor) };
  }

  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      score: true,
      createdAt: true,
      storeId: true,
      userId: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: whereCondition,
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};

