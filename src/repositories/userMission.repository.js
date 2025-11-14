import { prisma } from "../db.config.js";
import { DuplicateUserMissionError, ValidationError } from "../errors.js";

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
      throw new DuplicateUserMissionError("이미 도전하고 있는 미션입니다.", data);
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
    // 이미 커스텀 Error면 그대로 throw
    if (err.errorCode) {
      throw err;
    }
    throw new ValidationError(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`, data);
  }
};