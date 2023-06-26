const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.R_PG_USER,
  password: process.env.R_PG_PASSWORD,
  host: process.env.R_PG_HOST,
  port: 5432,
  database: process.env.R_PG_DATABASE
});

module.exports = pool;