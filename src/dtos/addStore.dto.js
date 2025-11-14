export const bodyToaddStore = (body) => {
  console.log("DTO body 받은 값:", body);
  console.log("DTO body.region_id:", body?.region_id);

  if (!body) {
    throw new Error("요청 body가 없습니다.");
  }

  return {
    region_id: body.region_id,
    name: body.name,
    address: body.address,
    oper_time: body.oper_time || {},
  };
};
