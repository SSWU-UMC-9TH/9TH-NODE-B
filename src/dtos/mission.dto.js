// [요청 DTO] 클라이언트 body → DB insert용 데이터 변환
export const bodyToMission = (body) => {
    return {
        reward: body.reward, // 필수
        deadline: new Date(body.deadline), // 필수
        missionSpec: body.missionSpec // 필수
    };
};

// [응답 DTO] DB → 클라이언트 응답 변환
export const responseFromMission = ({ mission }) => {
    const m = mission[0] || mission;

    return {
        id: m.id,
        storeId: m.store_id,
        reward: m.reward,
        deadline: m.deadline,
        missionSpec: m.mission_spec,
        createdAt: m.created_at,
        updatedAt: m.updated_at
    };
};

// [요청] 특정 가게의 미션 목록
export class ListStoreMissionsRequestDto {
    constructor(params) {
        this.storeId = Number(params.storeId);
    }
}

// [응답] 특정 가게의 미션 목록
export class MissionListResponseDto {
    constructor(missions) {
        this.missions = missions.map((m) => ({
            missionId: m.id,
            reward: m.reward,
            deadline: m.deadline,
            missionSpec: m.missionSpec,
            store: {
                id: m.store.id,
                name: m.store.name,
            },
        }));
    }
}