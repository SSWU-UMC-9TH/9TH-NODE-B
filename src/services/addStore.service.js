import {
  addStore,
} from "../repositories/addStore.repository.js";

export const storeUpdate = async (data) => {
  // 디버깅: data 확인
  console.log("=== Service storeUpdate 시작 ===");
  console.log("Service에서 받은 data 전체:", JSON.stringify(data, null, 2));
  console.log("Service에서 data.region_id 값:", data?.region_id);
  console.log("Service에서 data.region_id 타입:", typeof data?.region_id);
  
  // 에러 체크
  if (!data) {
    throw new Error(`Service: data가 없습니다`);
  }
  if (data.region_id === undefined || data.region_id === null) {
    throw new Error(`Service: region_id가 없습니다. data: ${JSON.stringify(data)}`);
  }
  
  // Repository에 전달할 객체 생성
  const storeData = {
    region_id: data.region_id,
    name: data.name,
    address: data.address,
    oper_time: data.oper_time,
  };
  
  console.log("Repository에 전달할 storeData:", JSON.stringify(storeData, null, 2));
  
  const addStoreId = await addStore(storeData);

  return { addStoreId };
};