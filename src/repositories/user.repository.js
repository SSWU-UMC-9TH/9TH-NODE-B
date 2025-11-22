import { prisma } from "../db.config.js";
import { UserNotFoundError, InvalidProviderError } from "../errors.js";

// User 데이터 삽입 또는 업데이트
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    // 이미 존재하는 사용자인 경우 provider 검증
    if (user.provider !== data.provider) {
      const providerName = user.provider === 'google' ? 'Google' : '이메일/비밀번호';
      throw new InvalidProviderError(
        `이미 ${providerName}로 가입한 계정입니다. 해당 방식으로 로그인해주세요.`,
        { existingProvider: user.provider, requestedProvider: data.provider }
      );
    }

    // 이미 존재하는 사용자인 경우 정보 업데이트
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name || user.name,
        gender: data.gender || user.gender,
        birth: data.birth || user.birth,
        address: data.address || user.address,
        phoneNumber: data.phoneNumber || user.phoneNumber,
        agree: data.agree !== undefined ? Boolean(data.agree) : user.agree,
        status: data.status || user.status,
        inactiveDate: data.inactiveDate || user.inactiveDate,
        point: data.point !== undefined ? data.point : user.point,
        // 비밀번호는 제공된 경우에만 업데이트
        password: data.password || user.password,
      },
    });
    return updated.id;
  }

  // provider가 지정되지 않은 경우 기본값 'local' 설정
  const userData = {
    ...data,
    provider: data.provider || 'local',
  };

  const created = await prisma.user.create({ data: userData });
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

// 사용자 정보 업데이트
export const updateUser = async (userId, data) => {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        phoneNumber: data.phoneNumber,
        agree: data.agree !== undefined ? Boolean(data.agree) : undefined,
        status: data.status,
        inactiveDate: data.inactiveDate,
        point: data.point,
        // 비밀번호는 제공된 경우에만 업데이트
        ...(data.password && { password: data.password }),
      },
    });
    return updated;
  } catch (err) {
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
