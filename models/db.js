const mysql = require("mysql");
// MySQL-------------------------------------------------------------------------------------------------------

const con = mysql.createConnection({
  //   connectionLimit: 10,
  // host: "localhost",
  // user: "jackrobertscoach_foodapp",
  // password: "n)qJ]mmnvuv$",
  // database: "jackrobertscoach_foodapp",
  // //multipleStatements:true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//checking MySql database connection status
con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});
//-------------------------------------------------------------------------------------------------------------
module.exports = con;
