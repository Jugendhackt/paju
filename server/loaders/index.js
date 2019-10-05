const mysqlLoader = require("./mysql");

module.exports = async function({
  expressApp
}) {
  // const sqlConnection = await mysqlLoader();
  console.log("MySqlDB Intialized");

  // *** DEBUG ***
  /*

  const sql = "";

   sqlConnection.query(sql, (err, result) => {
    if (err) { throw err; }
    console.debug(`Result: ${result}`);
  });

  */
  // ***

  // await expressLoader({ app: expressApp });
  // console.log('Express Intialized');

  // ... more loaders can be here
};
