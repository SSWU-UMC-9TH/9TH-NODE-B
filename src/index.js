// const express = require('express')  // -> CommonJS
import express from 'express'          // -> ES Module
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import swaggerAutogen from "swagger-autogen"
import swaggerUiExpress from "swagger-ui-express"
import passport from "passport"
import { googleStrategy, kakaoStrategy, localStrategy, jwtStrategy, generateAccessToken, generateRefreshToken } from "./auth.config.js"

// 컨트롤러 import
import { handleUserSignUp, handleUpdateUserInfo } from './controllers/user.controller.js'
import { handleLogin } from './controllers/auth.controller.js'
import { handleAddStore } from './controllers/addStore.controller.js'
import { handleAddStoreMission } from './controllers/addStoreMission.controller.js'
import { handleUserMission } from './controllers/userMission.controller.js'
import { handleAddReview } from './controllers/addReview.js'
import { handleListStoreReviews, handleListMyReviews } from './controllers/review.controller.js'
import { handleListStoreMissions, handleListMyMissions } from './controllers/mission.controller.js'

// Passport 전략 등록
passport.use(localStrategy); // 이메일/비밀번호 로그인
if (googleStrategy) {
  passport.use(googleStrategy);
}
if (kakaoStrategy) {
  passport.use(kakaoStrategy);
}
if (jwtStrategy) {
  passport.use(jwtStrategy);
}

const app = express()
const port = 3000

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

// 미들웨어 설정
app.use(compression({
  threshold: 512,  // 0.5kb = 512 bytes, 이보다 작은 응답은 압축하지 않음
}))
app.use(morgan('dev'))  // 로그 포맷: dev
app.use(cookieParser())  // 쿠키 파싱
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))  // form 데이터 파싱
app.use(passport.initialize())

// Swagger UI 설정
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

// Swagger OpenAPI JSON 엔드포인트
app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// OAuth 라우트 설정 (Google 전략이 설정되어 있을 때만)
if (googleStrategy) {
  app.get("/oauth2/login/google", 
    passport.authenticate("google", { 
      session: false 
    })
  );

  app.get(
    "/oauth2/callback/google",
    (req, res, next) => {
      console.log("OAuth 콜백 요청 받음:", {
        query: req.query,
        url: req.url,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        host: req.get('host'),
        fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
      });
      passport.authenticate("google", {
        session: false,
        failureRedirect: false,
      }, (err, user, info) => {
        if (err) {
          console.error("OAuth 에러 상세:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
            statusCode: err.statusCode,
            oauthError: err.oauthError,
            code: err.code,
            data: err.data,
            fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
          });
          
          // TokenError의 경우 더 자세한 정보 제공
          let errorReason = err.message || "Google 로그인 중 오류가 발생했습니다.";
          if (err.name === "TokenError") {
            if (err.code === "invalid_grant") {
              errorReason = `인증 코드가 유효하지 않습니다. 다음을 확인해주세요:
1. Google Cloud Console → OAuth 동의 화면에서 테스트 사용자에 본인 이메일 추가
2. 승인된 JavaScript 원본에 'http://localhost:3000' 추가
3. 브라우저 캐시 삭제 후 시크릿 모드로 재시도
4. 같은 인증 코드를 재사용하지 않도록 새로 로그인 시도`;
            } else {
              errorReason = "OAuth 토큰 교환 실패. 콜백 URL과 Client ID/Secret을 확인해주세요.";
            }
          }
          
          return res.status(400).error({
            errorCode: "OAUTH_ERROR",
            reason: errorReason,
            data: {
              errorType: err.name,
              oauthError: err.oauthError,
              code: err.code,
            },
          });
        }

        if (!user) {
          console.error("OAuth 사용자 정보 없음:", info);
          return res.status(400).error({
            errorCode: "OAUTH_FAILED",
            reason: info?.message || "Google 로그인에 실패했습니다.",
            data: info,
          });
        }

        req.user = user;
        next();
      })(req, res, next);
    },
    (req, res) => {
      const tokens = req.user; 

      res.status(200).json({
        resultType: "SUCCESS",
        error: null,
        success: {
            message: "Google 로그인 성공!",
            tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
        }
      });
    }
  );
}

// OAuth 라우트 설정 (Kakao 전략이 설정되어 있을 때만)
if (kakaoStrategy) {
  app.get("/oauth2/login/kakao", 
    passport.authenticate("kakao", { 
      session: false 
    })
  );

  app.get(
    "/oauth2/callback/kakao",
    (req, res, next) => {
      console.log("Kakao OAuth 콜백 요청 받음:", {
        query: req.query,
        url: req.url,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        host: req.get('host'),
        fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
      });
      passport.authenticate("kakao", {
        session: false,
        failureRedirect: false,
      }, (err, user, info) => {
        if (err) {
          console.error("Kakao OAuth 에러 상세:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
            statusCode: err.statusCode,
            oauthError: err.oauthError,
            code: err.code,
            data: err.data,
            fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
          });
          
          let errorReason = err.message || "카카오 로그인 중 오류가 발생했습니다.";
          if (err.name === "TokenError") {
            if (err.code === "invalid_grant") {
              errorReason = `인증 코드가 유효하지 않습니다. 다음을 확인해주세요:
1. 카카오 개발자 센터에서 Redirect URI가 'http://localhost:3000/oauth2/callback/kakao'로 설정되어 있는지 확인
2. 브라우저 캐시 삭제 후 시크릿 모드로 재시도
3. 같은 인증 코드를 재사용하지 않도록 새로 로그인 시도`;
            } else {
              errorReason = "OAuth 토큰 교환 실패. 콜백 URL과 Client ID를 확인해주세요.";
            }
          }
          
          return res.status(400).error({
            errorCode: "OAUTH_ERROR",
            reason: errorReason,
            data: {
              errorType: err.name,
              oauthError: err.oauthError,
              code: err.code,
            },
          });
        }

        if (!user) {
          console.error("Kakao OAuth 사용자 정보 없음:", info);
          return res.status(400).error({
            errorCode: "OAUTH_FAILED",
            reason: info?.message || "카카오 로그인에 실패했습니다.",
            data: info,
          });
        }

        req.user = user;
        next();
      })(req, res, next);
    },
    (req, res) => {
      const tokens = req.user; 

      res.status(200).json({
        resultType: "SUCCESS",
        error: null,
        success: {
            message: "카카오 로그인 성공!",
            tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
        }
      });
    }
  );
}

// JWT 인증 미들웨어 (JWT 전략이 설정되어 있을 때만)
const isLogin = jwtStrategy 
  ? passport.authenticate('jwt', { session: false })
  : (req, res, next) => {
      res.status(401).error({
        errorCode: "UNAUTHORIZED",
        reason: "JWT 인증이 설정되지 않았습니다.",
        data: null,
      });
    };

// 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 공개 라우트
app.post('/users/signup', handleUserSignUp)
app.post('/users/login', handleLogin) // 이메일/비밀번호 로그인
app.get('/stores/:storeId/reviews', handleListStoreReviews)
app.get('/stores/:storeId/missions', handleListStoreMissions)

// 보호된 라우트 (JWT 인증 필요)
app.post('/stores', isLogin, handleAddStore)
app.post('/stores/missions', isLogin, handleAddStoreMission)
app.post('/users/missions', isLogin, handleUserMission)
app.post('/reviews', isLogin, handleAddReview)

// 본인 정보 조회/수정 라우트 (JWT 인증 필요)
app.get('/users/:userId/reviews', isLogin, handleListMyReviews)
app.get('/users/:userId/missions', isLogin, handleListMyMissions)

// 보호된 라우트 예시 (JWT 인증 필요, JWT 전략이 설정되어 있을 때만)
if (jwtStrategy) {
  app.get('/mypage', isLogin, (req, res) => {
    // BigInt를 문자열로 변환하여 JSON 직렬화 문제 해결
    const userData = {
      ...req.user,
      id: String(req.user.id),
    };
    
    res.status(200).success({
      message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
      user: userData,
    });
  });

  // 사용자 정보 수정 API
  app.patch('/users/me', isLogin, handleUpdateUserInfo);
}

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error('에러 발생:', err.message);
  console.error('에러 스택:', err.stack);

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// 404 핸들러 (위에 정의되지 않은 라우트)
app.use((req, res) => {
  res.status(404).error({
    errorCode: "NOT_FOUND",
    reason: "요청한 경로를 찾을 수 없습니다.",
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})