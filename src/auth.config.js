import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import
import bcrypt from "bcrypt"; 

dotenv.config();

const secret = process.env.JWT_SECRET; // .env의 비밀 키 

// JWT 토큰 생성 함수들
export const generateAccessToken = (user) => {
  if (!secret) {
    throw new Error("JWT_SECRET이 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }
  // BigInt를 문자열로 변환하여 직렬화 문제 해결
  return jwt.sign(
    { id: String(user.id), email: user.email }, 
    secret,                           
    { expiresIn: '1h' }                 
  );
};

export const generateRefreshToken = (user) => {
  if (!secret) {
    throw new Error("JWT_SECRET이 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }
  // BigInt를 문자열로 변환하여 직렬화 문제 해결
  return jwt.sign(
    { id: String(user.id) },                   
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
    // provider 검증: Google로 가입한 사용자만 Google 로그인 가능
    if (user.provider !== 'google') {
      const providerName = user.provider === 'local' ? '이메일/비밀번호' : user.provider === 'kakao' ? '카카오' : user.provider;
      throw new Error(`이미 ${providerName}로 가입한 계정입니다. 해당 방식으로 로그인해주세요.`);
    }
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      provider: "google", // Google 로그인으로 가입
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// KakaoVerify
const kakaoVerify = async (profile) => {
  // 카카오는 이메일이 선택 동의이므로 없을 수 있음
  const email = profile._json?.kakao_account?.email;
  const nickname = profile.displayName || profile.username || '카카오 사용자';
  
  // 이메일이 없는 경우 카카오 ID를 이메일로 사용 (고유성 보장)
  const userEmail = email || `kakao_${profile.id}@kakao.local`;

  const user = await prisma.user.findFirst({ where: { email: userEmail } });
  if (user !== null) {
    // provider 검증: 카카오로 가입한 사용자만 카카오 로그인 가능
    if (user.provider !== 'kakao') {
      throw new Error('이미 다른 방식으로 가입한 계정입니다. 해당 방식으로 로그인해주세요.');
    }
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email: userEmail,
      name: nickname,
      provider: "kakao", // 카카오 로그인으로 가입
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy 
// 환경 변수가 설정되어 있을 때만 전략 생성
const callbackURL = process.env.PASSPORT_GOOGLE_CALLBACK_URL || "http://localhost:3000/oauth2/callback/google";

console.log("Google OAuth 설정:", {
  clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID ? "설정됨" : "없음",
  clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET ? "설정됨" : "없음",
  callbackURL: callbackURL,
});

export const googleStrategy = process.env.PASSPORT_GOOGLE_CLIENT_ID && process.env.PASSPORT_GOOGLE_CLIENT_SECRET
  ? new GoogleStrategy(
      {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL, 
        scope: ["email", "profile"],
      },
      
      async (accessToken, refreshToken, profile, cb) => {
        try {
          console.log("Google OAuth 프로필 받음:", {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
          });

          const user = await googleVerify(profile);
          
          const jwtAccessToken = generateAccessToken(user);
          const jwtRefreshToken = generateRefreshToken(user);

          return cb(null, {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
          });

        } catch (err) {
          console.error("GoogleStrategy 에러:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
          });
          return cb(err);
        }
      }
    )
  : null;

// Local Strategy (이메일/비밀번호 로그인)
export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { email } });

      if (!user) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // provider 검증: local로 가입한 사용자만 이메일/비밀번호 로그인 가능
      if (user.provider !== 'local') {
        const providerName = user.provider === 'google' ? 'Google' : user.provider === 'kakao' ? '카카오' : user.provider;
        return done(null, false, { 
          message: `${providerName}로 가입한 계정입니다. 해당 방식으로 로그인해주세요.` 
        });
      }

      // 비밀번호가 없는 경우 (이론적으로는 발생하지 않아야 함)
      if (!user.password) {
        return done(null, false, { message: '비밀번호가 설정되지 않은 계정입니다.' });
      }

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      return done(null, user);
    } catch (err) {
      console.error("LocalStrategy 에러:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return done(err);
    }
  }
);

// JWT Strategy
// JWT_SECRET이 설정되어 있을 때만 전략 생성
export const jwtStrategy = process.env.JWT_SECRET
  ? new JwtStrategy(
      {
        // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          // JWT payload의 id는 문자열로 저장되었으므로 BigInt로 변환
          // Prisma는 문자열을 BigInt로 자동 변환하지만, 명시적으로 변환하는 것이 안전
          const userId = BigInt(payload.id);
          const user = await prisma.user.findFirst({ where: { id: userId } });

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          console.error("JWT Strategy 에러:", err);
          return done(err, false);
        }
      }
    )
  : null;

