import { prisma } from "../db.config.js";

export const addStoreMission = async (data) => {
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