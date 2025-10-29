import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const base = new PrismaClient();

// 모든 쿼리 시간 로깅 미들웨어
export const prisma = base.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const start = Date.now();
                const result = await query(args);
                const duration = Date.now() - start;
                console.log(`[Prisma Query Log] ${model}.${operation} took ${duration}ms`);
                return result;
            },
        },
    },
});