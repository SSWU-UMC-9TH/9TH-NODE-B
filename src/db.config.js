import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// Prisma Client 생성 (쿼리 로깅 활성화)
export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// 쿼리 성능 측정 및 로깅
// 모든 Prisma 쿼리에 자동으로 적용됩니다
// Prisma의 query 이벤트는 이미 duration을 제공합니다
prisma.$on('query', (e) => {
  // e.duration은 Prisma가 자동으로 측정한 밀리초 값입니다
  console.log(`[Prisma Query] ${e.duration}ms`);
  console.log(`  Query: ${e.query}`);
  if (e.params) {
    console.log(`  Params: ${e.params}`);
  }
});
