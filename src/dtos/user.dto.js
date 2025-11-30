export const bodyToUser = (body) => {
    const birth = new Date(body.birth); //날짜 변환

    return {
        email: body.email, //필수
        password: body.password, // 필수
        name: body.name, // 필수
        gender: body.gender, // 필수
        birth, // 필수
        address: body.address || "", //선택 
        detailAddress: body.detailAddress || "", //선택 
        phoneNumber: String(body.phoneNumber),//필수
        preferences: body.preferences,// 필수 
    };
};

export const responseFromUser = ({ user, preferences }) => {
    const preferFoods = preferences.map(
        (preference) => preference.foodCategory.name
    );

    return {
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };
};

// 유저 정보 수정
export const bodyToUserUpdate = (body) => {
    const birth = body.birth ? new Date(body.birth) : undefined;

    return {
        name: body.name,
        gender: body.gender,
        birth,
        address: body.address,
        detailAddress: body.detailAddress,
        phoneNumber: body.phoneNumber ? String(body.phoneNumber) : undefined,
        preferences: body.preferences  // optional
    };
};