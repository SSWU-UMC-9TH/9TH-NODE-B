import { getStoreById, addMission, getMissionsByStoreId } from "../repositories/mission.repository.js";
import { NotFoundError, InternalServerError } from "../errors.js";

export const createMission = async (storeId, data) => {
    // 가게 존재 여부 확인
    const store = await getStoreById(storeId);
    if (!store) {
        throw new NotFoundError(`존재하지 않는 가게 ID입니다: ${storeId}`);
    }

    // 미션 등록
    try {
        const missionId = await addMission({
            storeId,
            reward: data.reward,
            deadline: data.deadline,
            missionSpec: data.missionSpec
        });

        return {
            id: missionId,
            store_id: storeId,
            reward: data.reward,
            deadline: data.deadline,
            mission_spec: data.missionSpec,
            created_at: new Date(),
            updated_at: new Date()
        };
    } catch (err) {
        throw new InternalServerError(`미션 등록 중 오류 발생: ${err.message}`);
    }
};

// 특정 가게의 미션 목록 조회
export const listStoreMissions = async (storeId) => {
    try {
        const missions = await getMissionsByStoreId(storeId);
        return missions;
    } catch (err) {
        throw new InternalServerError(`미션 목록 로딩 중 오류 발생: ${err.message}`);
    }
};