require('dotenv').config();
const { Pool } = require('pg');

console.log('PROCESS ENV SUMMARY:');
console.log('DATABASE_URL ->', process.env.DATABASE_URL);
console.log('PGUSER ->', process.env.PGUSER);
console.log('PGPASSWORD ->', process.env.PGPASSWORD);
console.log('PGHOST ->', process.env.PGHOST);
console.log('PGDATABASE ->', process.env.PGDATABASE);
console.log('PGPORT ->', process.env.PGPORT);
console.log('USER ->', process.env.USER);
console.log('USERNAME ->', process.env.USERNAME);

(async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    const res = await client.query("SELECT current_user, session_user, inet_server_addr()::text as server_ip");
    console.log('QUERY RESULT:', res.rows[0]);
    client.release();
    await pool.end();
  } catch (err) {
    console.error('DIAG ERROR:', err.message);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
