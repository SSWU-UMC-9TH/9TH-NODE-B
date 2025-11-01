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
    inactive_date: body.inactive_date || "",
    point: body.point || 0
  };
};


export const responseFromUser = ({ user, preferences }) => {
  const u = Array.isArray(user) ? user[0] : user; // getUser가 배열이면 첫 row 꺼냄
  if (!u) return null;

  return {
    id: u.id,
    email: u.email,
    name: u.name,
    gender: u.gender,
    birth: u.birth,                 // 그대로
    address: u.address,             // 그대로
    status: u.status,               // 그대로
    inactiveDate: u.inactive_date ?? null,
    phoneNumber: u.phone_number ?? null,
    point: u.point ?? 0,
    preferences: (preferences ?? []).map(p => ({
      id: p.id,                     // 매핑 테이블 row id
      categoryId: p.food_category_id,
      name: p.name                  // food_category.name
    })),
  };
};
