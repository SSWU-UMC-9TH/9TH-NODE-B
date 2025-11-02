import { getAllStoreReviews, getMyReviews } from "../repositories/review.repository.js";
import { responseFromReviews } from "../dtos/review.dto.js";

export const listStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listMyReviews = async (userId, cursor = 0) => {
  const reviews = await getMyReviews(userId, cursor);
  return responseFromReviews(reviews);
};

