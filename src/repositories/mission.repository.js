import { pool } from "../db.config.js";

export const getStoreById = async (storeId) => {
    const [rows] = await pool.query("SELECT * FROM store WHERE id = ?;", [storeId]);
    return rows.length > 0 ? rows[0] : null;
};

export const addMission = async (data) => {
    const conn = await pool.getConnection();
    try {
        console.log("[DEBUG] inserting mission data:", data); // 👈 추가
        const [result] = await conn.query(
            `INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW());`,
            [data.storeId, data.reward, data.deadline, data.missionSpec]
        );
        return result.insertId;
    } catch (err) {
        console.error("[ERROR] addMission SQL failed:", err); // 👈 추가
        throw new Error(`미션 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};
