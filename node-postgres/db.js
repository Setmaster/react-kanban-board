/**The pool object created below will allow you to query into the database that it’s connected to */


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'se7dev',
  host: 'localhost',
  database: 'database_db',
  password: 'se7dev',
  port: 5432,
});


module.exports = pool;

