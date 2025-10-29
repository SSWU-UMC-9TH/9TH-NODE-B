import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleCreateStore, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleCreateReview, handleListUserReviews } from "./controllers/review.controller.js";
import { handleCreateMission, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handleUserMissionChallenge } from "./controllers/userMission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);     // 회원가입
app.post("/api/v1/stores", handleCreateStore);          // 가게 등록
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);        // 리뷰 등록
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);      // 미션 등록
app.post("/api/v1/stores/:storeId/missions/:missionId/challenge", handleUserMissionChallenge);      // 가게 도전 중인 미션에 추가

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);     // 리뷰 조회
app.get("/api/v1/users/:userId/reviews", handleListUserReviews);        // 내가 작성한 리뷰 목록
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);   // 특정 가게의 미션 목록

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

// 전역 에러 핸들러
app.use((err, req, res, next) => {
    console.error("[Error Handler]", err);

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "서버 내부 오류가 발생했습니다.";

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
        },
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});