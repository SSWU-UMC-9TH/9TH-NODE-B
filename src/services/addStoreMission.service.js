import {
  addStoreMission,
} from "../repositories/addStoreMission.repository.js";

export const storeMissionUpdate = async (data) => {
  const addStoreMissionId = await addStoreMission({
    store_id: data.store_id,
    region_id: data.region_id,
    title: data.title,
    is_active: data.is_active,
    point: data.point,
  });

  return { addStoreMissionId };
};