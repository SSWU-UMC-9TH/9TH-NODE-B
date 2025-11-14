import { StatusCodes } from "http-status-codes";
import { listStoreReviews, listMyReviews } from "../services/review.service.js";

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).json({ result: reviews });
  } catch (error) {
    next(error);
  }
};

export const handleListMyReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor)
        : 0;

    const reviews = await listMyReviews(userId, cursor);
    res.status(StatusCodes.OK).json({ result: reviews });
  } catch (error) {
    next(error);
  }
};

