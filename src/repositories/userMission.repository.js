import { pool } from "../db.config.js";

export const getMissionById = async (missionId) => {
    const [rows] = await pool.query("SELECT * FROM mission WHERE id = ?;", [missionId]);
    return rows.length > 0 ? rows[0] : null;
};

export const findUserMission = async (userId, missionId) => {
    const [rows] = await pool.query(
        `SELECT * FROM user_mission
     WHERE user_id = ? AND mission_id = ? AND status = '진행중';`,
        [userId, missionId]
    );
    return rows.length > 0 ? rows[0] : null;
};

export const addUserMission = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO user_mission (user_id, mission_id, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW());`,
            [data.userId, data.missionId, data.status]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`미션 도전 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};