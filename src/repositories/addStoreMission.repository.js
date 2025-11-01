import { pool } from "../db.config.js";

export const addStoreMission = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query(
      `INSERT INTO \`mission\`
       (region_id, store_id, title, is_active, point)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.region_id,
        data.store_id,
        data.title,
        data.is_active,
        data.point,
      ]

    );

    return result.insertId;

  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};