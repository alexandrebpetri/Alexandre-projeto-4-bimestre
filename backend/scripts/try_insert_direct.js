require('dotenv').config();
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(
      `INSERT INTO games (name, description, price, release_date, developer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      ['Try Direct', 'desc', '1.00', '2025-12-15', 1]
    );
    console.log('INSERT RESULT:', res.rows[0]);
    await client.query('COMMIT');
  } catch (err) {
    console.error('INSERT ERROR:', err);
    try { await client.query('ROLLBACK'); } catch(e){}
  } finally {
    client.release();
    await pool.end();
  }
})();
