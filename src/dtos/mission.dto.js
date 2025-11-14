// 특정 가게의 미션 목록 응답
export const responseFromMissions = (missions) => {
  return {
    data: missions.map((mission) => ({
      id: Number(mission.id),
      title: mission.title,
      point: mission.point,
      isActive: mission.isActive,
      startedAt: mission.startedAt,
      endAt: mission.endAt,
      createdAt: mission.createdAt,
      store: {
        id: Number(mission.store.id),
        name: mission.store.name,
      },
    })),
    pagination: {
      cursor: missions.length ? Number(missions[missions.length - 1].id) : null,
    },
  };
};

// 내가 진행 중인 미션 목록 응답
export const responseFromUserMissions = (userMissions) => {
  return {
    data: userMissions.map((userMission) => ({
      id: Number(userMission.id),
      status: userMission.status,
      progressCount: userMission.progressCount,
      createdAt: userMission.createdAt,
      mission: {
        id: Number(userMission.mission.id),
        title: userMission.mission.title,
        point: userMission.mission.point,
        isActive: userMission.mission.isActive,
        startedAt: userMission.mission.startedAt,
        endAt: userMission.mission.endAt,
        store: {
          id: Number(userMission.mission.store.id),
          name: userMission.mission.store.name,
        },
      },
    })),
    pagination: {
      cursor: userMissions.length ? Number(userMissions[userMissions.length - 1].id) : null,
    },
  };
};

