const consola = require("consola");
const mysql = require("mysql");

module.exports = async context => {
  const db = await mysql.createConnection({
    host: "cherob.eu",
    user: "paju",
    database: "paju",
    password: process.env.MYSQL_PASSWORD
  });

  db.connect(err => {
    if (err) {
      throw err;
    }

    consola.success("MySQL connected!");
  });

  context.db = db;
};
