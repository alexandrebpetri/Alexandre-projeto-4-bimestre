require('dotenv').config();
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log('Setting default of games.id to nextval(\'games_id_seq\')');
    await client.query("ALTER TABLE games ALTER COLUMN id SET DEFAULT nextval('games_id_seq')");
    console.log('Adjusting sequence current value to max(id)+1');
    await client.query("SELECT setval('games_id_seq', ((SELECT COALESCE(MAX(id),0) + 1 FROM games))::bigint, false)");
    console.log('Done');
  } catch (err) {
    console.error('Error applying fix:', err);
  } finally {
    client.release();
    await pool.end();
  }
})();
