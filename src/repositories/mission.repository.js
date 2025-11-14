import { prisma } from "../db.config.js";

// 특정 가게의 미션 목록 조회 (cursor 기반 페이지네이션)
export const getStoreMissions = async (storeId, cursor = 0) => {
  const whereCondition = {
    storeId: BigInt(storeId),
  };

  // cursor가 0보다 크면 해당 cursor보다 큰 id만 조회
  if (cursor > 0) {
    whereCondition.id = { gt: BigInt(cursor) };
  }

  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      title: true,
      point: true,
      isActive: true,
      startedAt: true,
      endAt: true,
      createdAt: true,
      storeId: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: whereCondition,
    orderBy: { id: "asc" },
    take: 5,
  });

  return missions;
};

// 내가 진행 중인 미션 목록 조회 (cursor 기반 페이지네이션)
export const getMyMissions = async (userId, cursor = 0) => {
  const whereCondition = {
    userId: BigInt(userId),
  };

  // cursor가 0보다 크면 해당 cursor보다 큰 id만 조회
  if (cursor > 0) {
    whereCondition.id = { gt: BigInt(cursor) };
  }

  const userMissions = await prisma.userMission.findMany({
    select: {
      id: true,
      status: true,
      progressCount: true,
      createdAt: true,
      userId: true,
      missionId: true,
      mission: {
        select: {
          id: true,
          title: true,
          point: true,
          isActive: true,
          startedAt: true,
          endAt: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: whereCondition,
    orderBy: { id: "asc" },
    take: 5,
  });

  return userMissions;
};

