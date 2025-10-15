// [요청 DTO]
export const bodyToUserMission = (body) => {
    return {
        userId: body.userId,
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