// [요청 DTO]
export const bodyToUserMission = (body) => {
    return {
        status: "진행중"
    };
};

// [응답 DTO]
export const responseFromUserMission = ({ userMission }) => {
    const m = userMission[0] || userMission;
    return {
        id: m.id,
        userId: m.user_id,
        missionId: m.mission_id,
        status: m.status,
        createdAt: m.created_at,
        updatedAt: m.updated_at
    };
};

// [요청] 내가 진행 중인 미션 목록
export class ListUserActiveMissionsRequestDto {
    constructor(params) {
        this.userId = Number(params.userId);
    }
}

// [응답] 내가 진행 중인 미션 목록
export class UserActiveMissionListResponseDto {
    constructor(missions) {
        this.missions = missions.map((m) => ({
            userMissionId: m.id,
            missionId: m.mission.id,
            status: m.status,
            reward: m.mission.reward,
            deadline: m.mission.deadline,
            missionSpec: m.mission.missionSpec,
            store: {
                id: m.mission.store.id,
                name: m.mission.store.name,
            },
        }));
    }
}