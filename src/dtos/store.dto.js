// [요청 DTO] 클라이언트 요청 body → DB insert용 데이터로 변환
export const bodyToStore = (body) => {
    return {
        regionId: body.regionId,        // 필수
        name: body.name,                // 필수
        address: body.address || "",    // 선택
        score: body.score || null       // 선택 (평점 초기값 가능)
    };
};

// [응답 DTO] DB에서 가져온 store 데이터 → 클라이언트 응답용 변환
export const responseFromStore = ({ store }) => {
    const s = store[0] || store; // getStore() 결과가 배열일 수도 있으므로 대응

    return {
        id: s.id,
        regionId: s.region_id,
        name: s.name,
        address: s.address,
        score: s.score,
        createdAt: s.created_at,
        updatedAt: s.updated_at
    };
};

// 리뷰 목록 조회
export const responseFromReviews = (reviews) => {
    return {
        data: reviews,
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};