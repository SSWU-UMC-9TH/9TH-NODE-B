export const bodyToaddReview = (body) => {
  return {
    store_id: body.store_id,
    user_mission_id: body.user_mission_id || 0,
    review_image_id: body.review_image_id || 0,
    content: body.content,
    score: body.score,
  };
};
