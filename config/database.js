var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : process.env['DB_HOST'] || "localhost",
  user     : process.env['DB_USER'] || "root",
  password : process.env['DB_PASSWORD'] || "",
  database : process.env['DB_NAME'] || "learntocode",
  connectionLimit: 50,
  queueLimit: 30
});
module.exports = pool
