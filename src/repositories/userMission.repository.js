import { pool } from "../db.config.js";

export const userMission = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 중복 미션 체크
    // TODO: 비즈니스 로직 검토 필요 - (user_id, mission_id) 조합으로 중복 체크하는 것이 더 적절할 수 있음
    const [confirm] = await pool.query(
      `SELECT EXISTS(
        SELECT id FROM user_mission 
        WHERE user_id = ? AND mission_id = ?
      ) as mission_exists`,
      [data.user_id, data.mission_id]
    );

    if (confirm[0].mission_exists) {
      throw new Error("이미 도전하고 있는 미션입니다.");
    }

    // 유저 미션 삽입
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
      ]
    );

    return result.insertId;

  } catch (err) {
    // 이미 커스텀 에러면 그대로 throw, 아니면 일반 에러로 감싸기
    if (err.message === "이미 도전하고 있는 미션입니다.") {
      throw err;
    }
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  } finally {
    // 외부 finally 블록에서 connection 해제 보장
    conn.release();
  }
};