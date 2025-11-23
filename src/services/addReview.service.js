import {
  addReview,
} from "../repositories/addReview.js";

export const addStoreReview = async (data) => {
  const reviewId = await addReview({
    user_id: BigInt(data.user_id),
    store_id: BigInt(data.store_id),
    user_mission_id: data.user_mission_id ? BigInt(data.user_mission_id) : null,
    review_image_id: data.review_image_id || 0,
    content: data.content,
    score: data.score,
  });

  return { reviewId };
};