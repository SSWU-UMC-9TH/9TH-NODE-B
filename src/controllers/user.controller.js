import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        console.log("회원가입 요청");
        console.log("body:", req.body);

        const user = await userSignUp(bodyToUser(req.body));

        return res.status(StatusCodes.OK).success(user);
    } catch (err) {
        console.error("회원가입 처리 중 오류:", err);
        next(err);
    }
};