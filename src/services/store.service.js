import { addStore, getRegionById, getAllStoreReviews } from "../repositories/store.repository.js";
import { responseFromReviews } from "../dtos/store.dto.js";
import { NotFoundError, InternalServerError } from "../errors.js";

export const createStore = async (data) => {
    const { regionId, name, address, score } = data;

    // region 존재 여부 확인
    const region = await getRegionById(regionId);
    if (!region) {
        throw new NotFoundError(`존재하지 않는 지역 ID입니다: ${regionId}`);
    }

    try {
        // 가게 등록
        const storeId = await addStore({ regionId, name, address, score });
        return { id: storeId, regionId, name, address, score };
    } catch (err) {
        throw new InternalServerError(`가게 등록 중 오류 발생: ${err.message}`);
    }
};

// 리뷰 목록 조회
export const listStoreReviews = async (storeId) => {
    try {
        const reviews = await getAllStoreReviews(storeId);
        return responseFromReviews(reviews);
    } catch (err) {
        throw new InternalServerError(`리뷰 목록 조회 중 오류 발생: ${err.message}`);
    }
};