import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { StatusCodes } from "http-status-codes";
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import compression from "compression";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { prisma } from "./db.config.js";
import { googleStrategy, jwtStrategy, kakaoStrategy, localStrategy } from "./auth.config.js";
import { getUser } from "./repositories/user.repository.js";

import { handleUserSignUp, handleUpdateMyInfo, handleUserLogin } from "./controllers/user.controller.js";
import { handleCreateStore, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleCreateReview, handleListUserReviews } from "./controllers/review.controller.js";
import { handleCreateMission, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handleUserMissionChallenge, handleListUserActiveMissions } from "./controllers/userMission.controller.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

// 미들웨어 세팅
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev'));  // 로그 포맷: dev
app.use(cookieParser());
app.use(cors()); // cors 방식 허용
/*
특정 프론트엔드 주소 허용 시 다음과 같이 사용
app.use(cors({
  origin: ['http://localhost:3000', 'http://example.com']
}));
*/
app.use(express.static("public")); // 정적 파일 접근

// 세션 설정
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key", // .env에 키 저장 권장
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // https 적용 시 true
            maxAge: 1000 * 60 * 60 * 24 // 1일
        }
    })
);

app.use(passport.initialize());
app.use(passport.session())

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);
passport.use(kakaoStrategy);

// Passport Serialization (세션에 유저 ID 저장/복원)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUser(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


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

// 응답 압축 미들웨어 추가
app.use(
    compression({
        threshold: 512, // 0.5KB 이상일 때만 압축
        brotli: { enabled: true, zlib: { quality: 6 } },
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get('/test', (req, res) => {
    res.send('Hello!');
});

// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie;

    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

// jwt만 체크 -> 세션 로그인도 허용
const isLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // 세션 로그인 통과
    }
    // 세션이 없으면 JWT 체크
    return passport.authenticate('jwt', { session: false })(req, res, next);
};

app.get('/mypage', isLogin, (req, res) => {
    res.status(200).success({
        message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
        user: req.user,
    });
});

// swagger 설정
app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup({}, {
        swaggerOptions: {
            url: "/openapi.json",
        },
    })
);

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
        host: "43.201.183.113:3000",
        // Swagger에서 Authorize 테스트를 하기 위한 코드 추가
        schemes: ["http"],
        securityDefinitions: {
            BearerAuth: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
                description: "JWT Authorization header using the Bearer scheme. Example: \"Bearer <token>\""
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
});


app.get('/', (req, res) => {
    res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});


app.get('/login', (req, res) => {
    res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
});


app.get('/mypage', isLogin, (req, res) => {
    res.send(`
        <h1>마이페이지</h1>
        <p>환영합니다, ${req.cookies.username}님!</p>
        <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
});


app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});


app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});



// 구글 로그인
app.get("/oauth2/login/google",
    passport.authenticate("google", {
        session: false
    })
);
app.get(
    "/oauth2/callback/google",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login-failed",
    }),
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

// 카카오 로그인
app.get("/oauth2/login/kakao",
    passport.authenticate("kakao", { session: false })
);

app.get("/oauth2/callback/kakao",
    passport.authenticate("kakao", {
        session: false,
        failureRedirect: "/login-failed",
    }),
    (req, res) => {
        const tokens = req.user;

        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                message: "Kakao 로그인 성공!",
                tokens: tokens // { accessToken, refreshToken }
            }
        });
    }
);

app.post("/api/v1/users/signup", handleUserSignUp);     // 회원가입
app.post("/api/v1/users/login", handleUserLogin); // 로그인 연결
app.post("/api/v1/stores", isLogin, handleCreateStore);          // 가게 등록
app.post("/api/v1/stores/:storeId/reviews", isLogin, handleCreateReview);        // 리뷰 등록
app.post("/api/v1/stores/:storeId/missions", isLogin, handleCreateMission);      // 미션 등록
app.post("/api/v1/stores/:storeId/missions/:missionId/challenge", isLogin, handleUserMissionChallenge);      // 가게 도전 중인 미션에 추가

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);     // 리뷰 조회
app.get("/api/v1/users/:userId/reviews", handleListUserReviews);        // 내가 작성한 리뷰 목록
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);   // 특정 가게의 미션 목록
app.get("/api/v1/users/me/missions/active", isLogin, handleListUserActiveMissions);     // 내가 진행 중인 미션 목록

app.patch("/api/v1/users/me", isLogin, handleUpdateMyInfo);     // 개인정보 수정 API

// gzip 테스트 전용 라우트
app.get("/api/test/large", (req, res) => {
    const dummyText = "압축테스트".repeat(2000); // 약 10KB
    res.json({ message: dummyText });
});

// 404 Not Found 핸들러
app.use((req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
            message: "요청하신 API를 찾을 수 없습니다.",
            statusCode: StatusCodes.NOT_FOUND,
        },
    });
});

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).error({
        errorCode: err.errorCode || "unknown",
        reason: err.reason || err.message || null,
        data: err.data || null,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});