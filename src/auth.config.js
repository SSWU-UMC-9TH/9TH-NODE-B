import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail } from "./repositories/user.repository.js";

dotenv.config();
const secret = process.env.JWT_SECRET;

// Access Token 생성
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '1h' }
    );
};

// Refresh Token 생성
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        secret,
        { expiresIn: '14d' }
    );
};

// 1. Local Strategy (이메일/비밀번호)
export const localStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        try {
            const user = await findUserByEmail(email);
            if (!user) {
                return done(null, false, { message: "존재하지 않는 이메일입니다." });
            }

            // [검증] 가입 방식이 EMAIL인지 확인
            if (user.provider !== "EMAIL") {
                return done(null, false, {
                    message: `해당 계정은 ${user.provider}로 가입되었습니다. ${user.provider}로 로그인해주세요.`
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

// 2. Google Strategy
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            // 이메일로 유저 조회
            let user = await prisma.user.findFirst({ where: { email } });

            if (user) {
                // [검증] 이미 가입된 유저인 경우, Provider가 GOOGLE인지 확인
                if (user.provider !== "GOOGLE") {
                    return done(null, false, {
                        message: `이미 ${user.provider}로 가입된 이메일입니다. 해당 방식으로 로그인해주세요.`
                    });
                }
            } else {
                // 신규 유저 생성
                user = await prisma.user.create({
                    data: {
                        email: email,
                        name: profile.displayName,
                        provider: "GOOGLE", // 가입 방식 명시
                        password: null, // 소셜 로그인은 비밀번호 없음
                        gender: "추후 수정",
                        birth: new Date(1970, 0, 1),
                        address: "추후 수정",
                        detailAddress: "추후 수정",
                        phoneNumber: "추후 수정",
                    },
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

// 3. Kakao Strategy
export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "/oauth2/callback/kakao"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const kakaoEmail = profile._json.kakao_account.email;

            // 이메일로 유저 찾기
            let user = await prisma.user.findFirst({ where: { email: kakaoEmail } });

            // [검증] 이미 가입된 유저가 있다면 Provider 체크
            if (user) {
                if (user.provider !== "KAKAO") {
                    return done(null, false, {
                        message: `이미 ${user.provider}로 가입된 이메일입니다. 해당 방식으로 로그인해주세요.`
                    });
                }
            } else {
                // 신규 유저 생성
                user = await prisma.user.create({
                    data: {
                        email: kakaoEmail,
                        name: profile.username || "카카오 유저",
                        provider: "KAKAO", // 가입 방식 명시
                        password: null,
                        gender: "추후 수정",
                        birth: new Date(1970, 0, 1),
                        address: "추후 수정",
                        detailAddress: "추후 수정",
                        phoneNumber: "추후 수정",
                    },
                });
            }

            // [수정] 세션 사용을 위해 user 객체 반환으로 통일
            return done(null, user);

        } catch (error) {
            done(error);
        }
    }
);

// 4. JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await prisma.user.findFirst({ where: { id: payload.id } });

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});