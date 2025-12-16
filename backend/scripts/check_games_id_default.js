require('dotenv').config();
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const q1 = await client.query("SELECT column_default FROM information_schema.columns WHERE table_name='games' AND column_name='id'");
    console.log('column_default:', q1.rows[0] && q1.rows[0].column_default);
    const q2 = await client.query("SELECT pg_get_serial_sequence('games','id') as seq");
    console.log('pg_get_serial_sequence:', q2.rows[0] && q2.rows[0].seq);
    const q3 = await client.query("SELECT relname FROM pg_class WHERE relname LIKE '%games_id%'");
    console.log('pg_class matches for games_id*:', q3.rows.map(r=>r.relname));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
})();
