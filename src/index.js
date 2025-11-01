// const express = require('express')  // -> CommonJS
import express from 'express'          // -> ES Module
import cors from 'cors'

// 컨트롤러 import
import { handleUserSignUp } from './controllers/user.controller.js'
import { handleAddStore } from './controllers/addStore.controller.js'
import { handleAddStoreMission } from './controllers/addStoreMission.controller.js'
import { handleUserMission } from './controllers/userMission.controller.js'
import { handleAddReview } from './controllers/addReview.js'

const app = express()
const port = 3000

// 미들웨어 설정
app.use(cors())
app.use(express.json())

// 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/users/signup', handleUserSignUp)
app.post('/stores', handleAddStore)
app.post('/stores/missions', handleAddStoreMission)
app.post('/users/missions', handleUserMission)
app.post('/reviews', handleAddReview)

// 에러 핸들링 미들웨어 (라우트 정의 이후에 위치해야 함)
app.use((err, req, res, next) => {
  console.error('에러 발생:', err.message);
  console.error('에러 스택:', err.stack);

  // JSON 형태로 에러 응답
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 핸들러 (위에 정의되지 않은 라우트)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 경로를 찾을 수 없습니다.'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})