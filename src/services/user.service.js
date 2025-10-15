import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
    // 비밀번호 해싱
    const saltRounds = 10;  // 복잡도 수준
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const joinUserId = await addUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
    });

    if (joinUserId === null) {
        throw new Error("이미 존재하는 이메일입니다.");
    }

    // 선호 카테고리 매핑
    for (const preference of data.preferences) {
        await setPreference(joinUserId, preference);
    }

    // 유저 정보 반환
    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser({ user, preferences });
};