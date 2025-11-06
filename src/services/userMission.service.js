import { getMissionById, addUserMission, findUserMission, getUserActiveMissions } from "../repositories/userMission.repository.js";
import { NotFoundError, BadRequestError, InternalServerError } from "../errors.js";

export const createUserMission = async (storeId, missionId, data) => {
    const { userId } = data;

    // 미션 존재 여부 검증
    const mission = await getMissionById(missionId);
    if (!mission || mission.store_id != storeId) {
        throw new NotFoundError(`해당 가게(${storeId})에 유효한 미션(${missionId})이 없습니다.`);
    }

    // 이미 도전 중인지 검증
    const existingMission = await findUserMission(userId, missionId);
    if (existingMission) {
        throw new BadRequestError(`이미 도전 중인 미션입니다. (missionId: ${missionId})`);
    }

    try {
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
    } catch (err) {
        throw new InternalServerError(`미션 도전 등록 중 오류 발생: ${err.message}`);
    }
};

// 내가 진행 중인 미션 목록
export const listUserActiveMissions = async (userId) => {
    try {
        const missions = await getUserActiveMissions(userId);
        return missions;
    } catch (err) {
        throw new InternalServerError(`진행 중 미션 목록 로딩 중 오류 발생: ${err.message}`);
    }
};