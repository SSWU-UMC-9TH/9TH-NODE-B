import { prisma } from "../db.config.js";
import { InvalidStoreDataError } from "../errors.js";

// 지역&가게 데이터 삽입
export const addStore = async (data) => {
  // region_id 확인
  if (!data.region_id) {
    throw new InvalidStoreDataError(`region_id가 필요합니다. 받은 값: ${data.region_id}`, data);
  }

  const created = await prisma.store.create({
    data: {
      regionId: BigInt(data.region_id),
      name: data.name,
      address: data.address || null,
      operTime: data.oper_time ? data.oper_time : null,
    },
  });

  return Number(created.id);
};