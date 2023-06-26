const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres2",
  password: "7yw7iDJZCppLZP0txcaNOtWkdBpr8V8v",
  host: "dpg-cicqmll9aq03rjg1vnf0-a",
  port: 5432,
  database: "perntodo_3ycx"
});

module.exports = pool;