export const responseFromReviews = (reviews) => {
  return {
    data: reviews.map((review) => ({
      id: Number(review.id),
      content: review.content,
      score: review.score,
      createdAt: review.createdAt,
      user: {
        id: Number(review.user.id),
        name: review.user.name,
      },
      store: {
        id: Number(review.store.id),
        name: review.store.name,
      },
    })),
    pagination: {
      cursor: reviews.length ? Number(reviews[reviews.length - 1].id) : null,
    },
  };
};

