// const express = require('express')  // -> CommonJS
import express from 'express'          // -> ES Module
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import swaggerAutogen from "swagger-autogen"
import swaggerUiExpress from "swagger-ui-express"

// 컨트롤러 import
import { handleUserSignUp } from './controllers/user.controller.js'
import { handleAddStore } from './controllers/addStore.controller.js'
import { handleAddStoreMission } from './controllers/addStoreMission.controller.js'
import { handleUserMission } from './controllers/userMission.controller.js'
import { handleAddReview } from './controllers/addReview.js'
import { handleListStoreReviews, handleListMyReviews } from './controllers/review.controller.js'
import { handleListStoreMissions, handleListMyMissions } from './controllers/mission.controller.js'

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

// 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/users/signup', handleUserSignUp)
app.post('/stores', handleAddStore)
app.post('/stores/missions', handleAddStoreMission)
app.post('/users/missions', handleUserMission)
app.post('/reviews', handleAddReview)
app.get('/stores/:storeId/reviews', handleListStoreReviews)
app.get('/users/:userId/reviews', handleListMyReviews)
app.get('/stores/:storeId/missions', handleListStoreMissions)
app.get('/users/:userId/missions', handleListMyMissions)

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