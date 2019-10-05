const mysql = require("mysql");

module.exports = async () => {
  const connection = await mysql.createConnection({
    host: "cherob.eu",
    user: "paju",
    password: "jrSjN2i7XkwTk2rT#E6q&Co7spdX"
  });

  connection.connect(err => {
    if (err) {
        throw err;
    }
    console.log("Connected!");
  });
  return connection;
};
