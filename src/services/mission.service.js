import { getStoreById, addMission } from "../repositories/mission.repository.js";

export const createMission = async (storeId, data) => {
    // 가게 존재 여부 확인
    const store = await getStoreById(storeId);
    if (!store) {
        throw new Error(`존재하지 않는 가게 ID입니다: ${storeId}`);
    }

    // 미션 등록
    const missionId = await addMission({
        storeId,
        reward: data.reward,
        deadline: data.deadline,
        missionSpec: data.missionSpec
    });

    // 응답용 데이터 반환
    return {
        id: missionId,
        store_id: storeId,
        reward: data.reward,
        deadline: data.deadline,
        mission_spec: data.missionSpec,
        created_at: new Date(),
        updated_at: new Date()
    };
};