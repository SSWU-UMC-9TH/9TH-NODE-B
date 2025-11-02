import { prisma } from "../db.config.js";

export const userMission = async (data) => {
  try {
    // mission_id로 이미 존재하는 user_mission 확인
    const existing = await prisma.userMission.findFirst({
      where: {
        userId: BigInt(data.user_id),
        missionId: BigInt(data.mission_id),
      },
    });

    if (existing) {
      throw new Error("이미 도전하고 있는 미션입니다.");
    }

    // 새로운 user_mission 생성
    const result = await prisma.userMission.create({
      data: {
        userId: BigInt(data.user_id),
        missionId: BigInt(data.mission_id),
        reviewId: data.review_id || 0,
        status: data.status || null,
        progressCount: data.progress_count || null,
      },
    });

    return Number(result.id);
  } catch (err) {
    if (err.message === "이미 도전하고 있는 미션입니다.") {
      throw err;
    }
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`);
  }
};