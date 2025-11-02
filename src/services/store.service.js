import { addStore, getRegionById } from "../repositories/store.repository.js";
import { responseFromReviews } from "../dtos/store.dto.js";

export const createStore = async (data) => {
    const { regionId, name, address, score } = data;

    // region 존재 여부 확인
    const region = await getRegionById(regionId);
    if (!region) {
        throw new Error(`존재하지 않는 지역 ID입니다: ${regionId}`);
    }

    // 가게 등록
    const storeId = await addStore({ regionId, name, address, score });
    return { id: storeId, regionId, name, address, score };
};

// 리뷰 목록 조회
export const listStoreReviews = async (storeId) => {
    const reviews = await getAllStoreReviews(storeId);
    return responseFromReviews(reviews);
};