export const bodyToaddUserMission = (body) => {

  return {
    user_id: body.user_id,
    mission_id: body.mission_id,
    review_id: body.review_id || 0,
    status: body.status || "Before starting",
    progress_count: body.progress_count || 0,
  };
};
