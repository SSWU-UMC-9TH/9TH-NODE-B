import bcrypt from 'bcrypt';
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, InvalidPasswordError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  updateUser,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  // 비밀번호 검증 (비밀번호가 제공된 경우에만)
  if (data.password && data.password.length < 8) {
    throw new InvalidPasswordError("비밀번호는 8자 이상이어야 합니다.", data);
  }

  // 비밀번호 해싱 (비밀번호가 제공된 경우에만)
  let hashedPassword = data.password;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }

  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword, // 해싱된 비밀번호 저장 (없으면 undefined)
    provider: 'local', // 이메일/비밀번호 회원가입
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    //detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    agree: data.agree,
    status: data.status,
    inactiveDate: data.inactiveDate,
    point: data.point
  });

  // 이제 addUser는 이미 존재하는 사용자도 업데이트하므로 null을 반환하지 않음
  // 하지만 기존 로직과의 호환성을 위해 유지

  // 선호 카테고리가 제공된 경우에만 설정
  if (data.preferences && Array.isArray(data.preferences) && data.preferences.length > 0) {
    for (const preference of data.preferences) {
      await setPreference(joinUserId, preference);
    }
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const updateUserInfo = async (userId, data) => {
  // 비밀번호가 제공된 경우 해싱
  let updateData = { ...data };
  if (data.password) {
    if (data.password.length < 8) {
      throw new InvalidPasswordError("비밀번호는 8자 이상이어야 합니다.", data);
    }
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updated = await updateUser(userId, updateData);
  const preferences = await getUserPreferencesByUserId(userId);

  return responseFromUser({ user: updated, preferences });
};
