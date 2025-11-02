import { getStoreMissions, getMyMissions } from "../repositories/mission.repository.js";
import { responseFromMissions, responseFromUserMissions } from "../dtos/mission.dto.js";

// 특정 가게의 미션 목록
export const listStoreMissions = async (storeId, cursor = 0) => {
  const missions = await getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};

// 내가 진행 중인 미션 목록
export const listMyMissions = async (userId, cursor = 0) => {
  const userMissions = await getMyMissions(userId, cursor);
  return responseFromUserMissions(userMissions);
};

