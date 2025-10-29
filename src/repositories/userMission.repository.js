import { pool } from "../db.config.js";

// 미션 ID로 미션 조회
export const getMissionById = async (missionId) => {
    return await prisma.mission.findUnique({
        where: { id: missionId },
    });
};

// 유저의 진행 중 미션 조회
export const findUserMission = async (userId, missionId) => {
    return await prisma.userMission.findFirst({
        where: {
            userId,
            missionId,
            status: "진행중",
        },
    });
};

// 유저 미션 등록
export const addUserMission = async (data) => {
    try {
        const created = await prisma.userMission.create({
            data: {
                userId: data.userId,
                missionId: data.missionId,
                status: data.status,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return created.id;
    } catch (err) {
        throw new Error(`미션 도전 등록 중 오류 발생: ${err.message}`);
    }
};