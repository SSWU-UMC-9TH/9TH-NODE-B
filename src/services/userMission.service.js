import { getMissionById, addUserMission, findUserMission } from "../repositories/userMission.repository.js";

export const createUserMission = async (storeId, missionId, data) => {
    const { userId } = data;

    // 미션 존재 여부 검증
    const mission = await getMissionById(missionId);
    if (!mission || mission.store_id != storeId) {
        throw new Error(`해당 가게(${storeId})에 유효한 미션(${missionId})이 없습니다.`);
    }

    // 이미 도전 중인지 검증
    const existingMission = await findUserMission(userId, missionId);
    if (existingMission) {
        throw new Error(`이미 도전 중인 미션입니다. (missionId: ${missionId})`);
    }

    // 새 미션 등록
    const userMissionId = await addUserMission({
        userId,
        missionId,
        status: "진행중"
    });

    return {
        id: userMissionId,
        user_id: userId,
        mission_id: missionId,
        status: "진행중",
        created_at: new Date(),
        updated_at: new Date()
    };
};