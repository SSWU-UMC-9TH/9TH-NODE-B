import { pool } from "../db.config.js";


export const userMission = async (data) => {
  const conn = await pool.getConnection();

  
  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT id FROM user_mission WHERE mission_id = ?) as user_mission_id;`,
      data.user_mission_id
    );

    if (!(confirm[0].user_mission_id)) {
        try {
                const [result] = await pool.query(
                `INSERT INTO \`user_mission\`
                (user_id, mission_id, review_id, status, progress_count)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    data.user_id,
                    data.mission_id,
                    data.review_id,
                    data.status,
                    data.progress_count,
                ]);

            return result.insertId;

            } catch (err) {
                throw new Error(
                    `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
                );
            }
         finally {
                conn.release();
            }}
      
    } catch (err) {
                throw new Error(
                    "이미 도전하고 있는 미션입니다."
                );
            }
        };