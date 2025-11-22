export const bodyToUser = (body) => {
  return {
    email: body.email,
    password: body.password,
    name: body.name,
    gender: body.gender,
    birth: body.birth ? new Date(body.birth) : undefined,
    address: body.address,
    phoneNumber: body.phoneNumber,
    preferences: body.preferences || [],
    agree: body.agree,
    status: body.status,
    inactiveDate: body.inactiveDate ? new Date(body.inactiveDate) : undefined,
    point: body.point,
  };
};

export const bodyToUserUpdate = (body) => {
  return {
    name: body.name,
    gender: body.gender,
    birth: body.birth ? new Date(body.birth) : undefined,
    address: body.address,
    phoneNumber: body.phoneNumber,
    password: body.password,
    agree: body.agree,
    status: body.status,
    inactiveDate: body.inactiveDate ? new Date(body.inactiveDate) : undefined,
    point: body.point,
  };
};

export const responseFromUser = ({ user, preferences }) => {
  return {
    id: Number(user.id),
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    status: user.status,
    inactiveDate: user.inactiveDate,
    phoneNumber: user.phoneNumber,
    point: user.point,
    preferences: preferences.map((pref) => ({
      id: Number(pref.id),
      categoryId: Number(pref.foodCategoryId),
      name: pref.foodCategory?.name || null,
    })),
  };
};
