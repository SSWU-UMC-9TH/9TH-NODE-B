import { prisma } from "../db.config.js";

// 지역 존재 여부 확인
export const getRegionById = async (regionId) => {
    const [rows] = await pool.query(`SELECT * FROM region WHERE id = ?;`, [regionId]);
    return rows.length > 0 ? rows[0] : null;
};

// 가게 추가
export const addStore = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO store (region_id, name, address, score, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW());`,
            [data.regionId, data.name, data.address, data.score]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`가게 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};

// 리뷰 목록 조회
export const getAllStoreReviews = async (storeId, cursor) => {
    const reviews = await prisma.userStoreReview.findMany({
        select: { id: true, content: true, store: true, user: true },
        where: { storeId: storeId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
};