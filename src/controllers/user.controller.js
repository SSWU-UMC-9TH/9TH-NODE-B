import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        console.log("회원가입 요청:", req.body);

        const user = await userSignUp(bodyToUser(req.body));
        res.status(StatusCodes.CREATED).json({ success: true, result: user });
    } catch (error) {
        next(error);
    }
};