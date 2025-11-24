import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing) return null;

    const created = await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            name: data.name,
            gender: data.gender,
            birth: data.birth,
            address: data.address,
            detailAddress: data.detailAddress,
            phoneNumber: data.phoneNumber,
        },
    });
    return created.id;
};


// 사용자 정보 얻기
export const getUser = async (userId) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
    await prisma.userFavorCategory.create({
        data: { userId, foodCategoryId },
    });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
    const preferences = await prisma.userFavorCategory.findMany({
        where: { userId },
        include: { foodCategory: true },
        orderBy: { foodCategoryId: "asc" },
    });
    return preferences;
};

// 유저 정보 업데이트
export const updateUser = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data
    });
};

// 유저 정보 삭제
export const clearPreferences = async (userId) => {
    return prisma.userFavorCategory.deleteMany({
        where: { userId }
    });
};
