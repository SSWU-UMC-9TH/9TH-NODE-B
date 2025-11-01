import bcrypt from 'bcrypt';
import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  // 비밀번호 검증
  if (!data.password || data.password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야 합니다.");
  }

  // 비밀번호 해싱 (salt rounds: 10)
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword, // 해싱된 비밀번호 저장
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    //detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    agree: data.agree,
    status: data.status,
    inactive_date: data.inactive_date,
    point: data.point
  });


  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};