const consola = require("consola");
const mysql = require("mysql");

module.exports = async () => {
  const connection = await mysql.createConnection({
    host: "cherob.eu",
    user: "paju",
    database: "paju",
    password: process.env.MYSQL_PASSWORD
  });

  connection.connect(err => {
    if (err) {
        throw err;
    }

    consola.success("MySQL Connected!");
  });

  return connection;
};
