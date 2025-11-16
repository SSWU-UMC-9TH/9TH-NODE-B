import { prisma } from "../db.config.js";
import { UserNotFoundError } from "../errors.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: data });
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
  } catch (err) {
    // Prisma의 NotFoundError를 UserNotFoundError로 변환
    if (err.code === 'P2025') {
      throw new UserNotFoundError("사용자를 찾을 수 없습니다.", { userId });
    }
    throw err;
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.preferenceSurvey.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.preferenceSurvey.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};
