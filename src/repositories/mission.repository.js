import { prisma } from "../db.config.js";

// 특정 가게 조회
export const getStoreById = async (storeId) => {
    return await prisma.store.findUnique({
        where: { id: storeId },
    });
};

// 미션 추가
export const addMission = async (data) => {
    try {
        const mission = await prisma.mission.create({
            data: {
                storeId: data.storeId,
                reward: data.reward,
                deadline: data.deadline,
                missionSpec: data.missionSpec,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return mission.id;
    } catch (err) {
        throw new Error(`미션 등록 중 오류 발생: ${err.message}`);
    }
};

// 특정 가게의 미션 목록 조회
export const getMissionsByStoreId = async (storeId) => {
    try {
        const missions = await prisma.mission.findMany({
            where: { storeId: Number(storeId) },
            orderBy: { id: "asc" },
            include: {
                store: { select: { id: true, name: true } },
            },
        });
        return missions;
    } catch (err) {
        throw new Error(`미션 목록 조회 중 오류 발생: ${err.message}`);
    }
};