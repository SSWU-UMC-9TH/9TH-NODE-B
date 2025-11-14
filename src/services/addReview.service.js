import {
  addReview,
} from "../repositories/addReview.js";

export const addStoreReview = async (data) => {
  const reviewId = await addReview({
    user_id: data.user_id,
    store_id: data.store_id,
    user_mission_id: data.user_mission_id,
    review_image_id: data.review_image_id,
    content: data.content,
    score: data.score,
  });

  return { reviewId };
};