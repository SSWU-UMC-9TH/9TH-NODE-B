import { prisma } from "../db.config.js";
import { StoreNotFoundError } from "../errors.js";

// 리뷰 데이터 삽입
export const addReview = async (data) => {
  // 가게 존재 여부 확인
  const store = await prisma.store.findFirst({
    where: { id: BigInt(data.store_id) },
  });

  if (!store) {
    throw new StoreNotFoundError("가게가 존재하지 않습니다.", { store_id: data.store_id });
  }

  // 리뷰 삽입
  const created = await prisma.review.create({
    data: {
      userId: BigInt(data.user_id),
      storeId: BigInt(data.store_id),
      userMissionId: data.user_mission_id ? BigInt(data.user_mission_id) : null,
      reviewImageId: data.review_image_id || 0,
      content: data.content,
      score: data.score,
    },
  });

  return Number(created.id);
};