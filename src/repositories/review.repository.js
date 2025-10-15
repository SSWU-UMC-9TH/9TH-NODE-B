import { pool } from "../db.config.js";

export const getStoreById = async (storeId) => {
    const [rows] = await pool.query("SELECT * FROM store WHERE id = ?;", [storeId]);
    return rows.length > 0 ? rows[0] : null;
};

export const addReview = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO review (user_id, store_id, body, score, created_at)
       VALUES (?, ?, ?, ?, NOW());`,
            [data.userId, data.storeId, data.body, data.score]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`리뷰 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};

export const addReviewImage = async (data) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            `INSERT INTO review_image (review_id, store_id, image_url, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW());`,
            [data.reviewId, data.storeId, data.imageUrl]
        );
    } catch (err) {
        throw new Error(`리뷰 이미지 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};