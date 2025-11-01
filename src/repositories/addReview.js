import { pool } from "../db.config.js";

// 리뷰 데이터 삽입
export const addReview = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 가게 존재 여부 확인
    // TODO: 테이블 스키마 확인 필요 (store_id 컬럼 vs id 컬럼)
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT id FROM store WHERE id = ?) as store_exists`,
      [data.store_id]
    );

    if (!confirm[0].store_exists) {
      throw new Error("가게가 존재하지 않습니다.");
    }

    // 리뷰 삽입
    const [result] = await pool.query(
      `INSERT INTO \`review\`
      (user_id, store_id, user_mission_id, review_image_id, content, score)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.store_id,
        data.user_mission_id,
        data.review_image_id,
        data.content,
        data.score,
      ]
    );

    return result.insertId;

  } catch (err) {
    // 이미 커스텀 에러면 그대로 throw, 아니면 일반 에러로 감싸기
    if (err.message === "가게가 존재하지 않습니다.") {
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