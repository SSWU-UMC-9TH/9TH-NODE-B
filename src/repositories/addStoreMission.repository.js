import { prisma } from "../db.config.js";
import { StoreNotFoundError, ValidationError } from "../errors.js";

export const addStoreMission = async (data) => {
  // store_id 확인
  if (!data.store_id) {
    throw new ValidationError("store_id가 필요합니다.", data);
  }

  // 가게 존재 여부 확인
  const store = await prisma.store.findFirst({
    where: { id: BigInt(data.store_id) },
  });

  if (!store) {
    throw new StoreNotFoundError("가게가 존재하지 않습니다.", { store_id: data.store_id });
  }

  const created = await prisma.mission.create({
    data: {
      regionId: data.region_id ? BigInt(data.region_id) : null,
      storeId: BigInt(data.store_id),
      title: data.title || null,
      isActive: data.is_active ?? null,
      point: data.point || null,
    },
  });

  return Number(created.id);
};