export const bodyToaddStoreMission = (body) => {

  return {
    store_id: body.store_id,
    region_id: body.region_id,
    title: body.title,
    is_active: body.is_active || 0,
    point: body.point || 1000,
  };
};
