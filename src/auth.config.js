import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import 
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as KakaoStrategy } from "passport-kakao";

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키 

//  Access Token과 Refresh Token을 생성하는 헬퍼 함수 정의
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '1h' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        secret,
        { expiresIn: '14d' }
    );
};

// GoogleVerify 
const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }

    const created = await prisma.user.create({
        data: {
            email,
            name: profile.displayName,
            gender: "추후 수정",
            birth: new Date(1970, 0, 1),
            address: "추후 수정",
            detailAddress: "추후 수정",
            phoneNumber: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy 
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "/oauth2/callback/google",
        scope: ["email", "profile"],
    },


    async (accessToken, refreshToken, profile, cb) => {
        try {
            const user = await googleVerify(profile);

            const jwtAccessToken = generateAccessToken(user);
            const jwtRefreshToken = generateRefreshToken(user);

            return cb(null, {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
            });
        } catch (err) {
            return cb(err);
        }
    }
);

// kakao 로그인
export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "/oauth2/callback/kakao"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const kakaoEmail = profile._json && profile._json.kakao_account.email;

            if (!kakaoEmail) {
                return done(new Error("카카오 계정에 이메일 접근 권한이 없습니다."));
            }

            // 유저 존재 체크
            let user = await prisma.user.findFirst({ where: { email: kakaoEmail } });
            if (!user) {
                // 새 유저 생성
                user = await prisma.user.create({
                    data: {
                        email: kakaoEmail,
                        name: profile.username,
                        gender: "추후 수정",
                        birth: new Date(1970, 0, 1),
                        address: "추후 수정",
                        detailAddress: "추후 수정",
                        phoneNumber: "추후 수정",
                    },
                });
            }

            const jwtAccessToken = generateAccessToken(user);
            const jwtRefreshToken = generateRefreshToken(user);

            return done(null, {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
            });

        } catch (error) {
            done(error);
        }
    }
);

// JWT 검증 미들웨어
const jwtOptions = {
    // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
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