import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    updateUser,
    clearPreferences
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
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
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

export const updateMyInfo = async (userId, data) => {
    const updateData = {};

    if (data.name) updateData.name = data.name;
    if (data.gender) updateData.gender = data.gender;
    if (data.birth) updateData.birth = new Date(data.birth);
    if (data.address) updateData.address = data.address;
    if (data.detailAddress) updateData.detailAddress = data.detailAddress;
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;

    const updatedUser = await updateUser(userId, updateData);

    // preferences 수정
    if (Array.isArray(data.preferences)) {
        await clearPreferences(userId);
        for (const p of data.preferences) {
            await setPreference(userId, p);
        }
    }

    const preferences = await getUserPreferencesByUserId(userId);

    return responseFromUser({ user: updatedUser, preferences });
};