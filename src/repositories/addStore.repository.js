import { pool } from "../db.config.js";

// 지역&가게 데이터 삽입
export const addStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    // region_id 확인
    if (!data.region_id) {
      throw new Error(`region_id가 필요합니다. 받은 값: ${data.region_id}`);
    }

    // oper_time을 JSON 문자열로 변환
    const operTimeJson = typeof data.oper_time === 'object' 
      ? JSON.stringify(data.oper_time) 
      : data.oper_time;

    console.log('Repository에서 받은 data:', { 
      region_id: data.region_id, 
      name: data.name, 
      address: data.address 
    });

    const [result] = await pool.query(
      `INSERT INTO \`store\`
       (region_id, name, address, oper_time)
       VALUES (?, ?, ?, ?)`,
      [
        data.region_id,
        data.name,
        data.address,
        operTimeJson,
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