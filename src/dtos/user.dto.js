export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    password: body.password, // 필수 - 비밀번호 (해싱 전)
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    // detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수
    agree: body.agree || 1,
    status: body.status || 'Active',
    inactiveDate: body.inactiveDate || null,
    point: body.point || 0
  };
};


export const responseFromUser = ({ user, preferences }) => {
  if (!user) return null;

  return {
    id: Number(user.id),
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    status: user.status,
    inactiveDate: user.inactiveDate ?? null,
    phoneNumber: user.phoneNumber ?? null,
    point: user.point ?? 0,
    preferences: (preferences ?? []).map(p => ({
      id: Number(p.id),
      categoryId: Number(p.foodCategoryId),
      name: p.foodCategory?.name ?? null
    })),
  };
};
