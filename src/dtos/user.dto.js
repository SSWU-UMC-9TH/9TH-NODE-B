export const bodyToUser = (body) => {
    const birth = new Date(body.birth); //날짜 변환

    return {
        email: body.email, //필수 
        name: body.name, // 필수
        gender: body.gender, // 필수
        birth, // 필수
        address: body.address || "", //선택 
        detailAddress: body.detailAddress || "", //선택 
        phoneNumber: body.phoneNumber,//필수
        preferences: body.preferences,// 필수 
    };
};

export const responseFromUser = ({ user, preferences }) => {
    const u = user[0]; // getUser() 결과는 배열 형태이므로 첫 번째 요소 사용

    return {
        id: u.id,
        email: u.email,
        name: u.name,
        gender: u.gender,
        birth: u.birth,
        address: u.address,
        detailAddress: u.detail_address, // DB 컬럼명 -> 클라이언트용으로 변환
        phoneNumber: u.phone_number,
        preferences: preferences.map((pref) => ({
            id: pref.food_category_id,
            name: pref.name,
        })),
    };
};
