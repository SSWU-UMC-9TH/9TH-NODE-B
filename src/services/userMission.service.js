import {
  userMission,
} from "../repositories/userMission.repository.js";

export const userMissionUpdate = async (data) => {
  const reviewId = await userMission({
    user_id: data.user_id,
    mission_id: data.mission_id,
    review_id: data.review_id,
    status: data.status,
    progress_count: data.progress_count,
  });

  return { reviewId };
};