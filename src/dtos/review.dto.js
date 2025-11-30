// [요청 DTO] 클라이언트 body → DB insert용 데이터 변환
export const bodyToReview = (body) => {
    return {
        body: body.body,               // 필수 (리뷰 내용)
        score: body.score,             // 필수
        images: body.images || []      // 선택 (이미지 배열)
    };
};

// [응답 DTO] DB → 클라이언트 응답 변환
export const responseFromReview = ({ review, images = [] }) => {
    const r = review[0] || review;

    return {
        id: r.id,
        storeId: r.store_id,
        userId: r.user_id,
        body: r.body,
        score: r.score,
        images: images.map((img) => ({
            id: img.id,
            imageUrl: img.image_url,
            createdAt: img.created_at
        })),
        createdAt: r.created_at
    };
};

// [요청] 내가 작성한 리뷰 목록 조회
export class ListUserReviewsRequestDto {
    constructor(params, query) {
        this.userId = Number(params.userId);
        this.cursor = query.cursor ? Number(query.cursor) : null;
    }
}

// [응답] 내가 작성한 리뷰 목록 조회
export class UserReviewListResponseDto {
    constructor(reviews, nextCursor) {
        this.reviews = reviews.map((r) => ({
            reviewId: r.id,
            content: r.content,
            store: {
                id: r.store.id,
                name: r.store.name,
            },
        }));
        this.nextCursor = nextCursor;
    }
}