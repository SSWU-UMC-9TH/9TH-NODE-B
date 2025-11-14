import { StatusCodes } from "http-status-codes";
import { listStoreMissions, listMyMissions } from "../services/mission.service.js";

// 특정 가게의 미션 목록
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};

// 내가 진행 중인 미션 목록
export const handleListMyMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const missions = await listMyMissions(userId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};

