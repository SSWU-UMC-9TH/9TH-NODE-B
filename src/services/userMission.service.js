import {
  userMission,
} from "../repositories/userMission.repository.js";

export const userMissionUpdate = async (data) => {
  const reviewId = await userMission({
    user_id: BigInt(data.user_id),
    mission_id: BigInt(data.mission_id),
    review_id: data.review_id || 0,
    status: data.status,
    progress_count: data.progress_count,
  });

  return { reviewId };
};