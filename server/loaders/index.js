const mysqlLoader = require("./mysql");

module.exports = async function({
  expressApp
}) {
  const sqlConnection = await mysqlLoader();
  console.log("MySqlDB Intialized");

    const sql = "SELECT * FROM `playlist` ";

   sqlConnection.query(sql, (err, result) => {
    if (err) { throw err; }
    console.debug(`Result: ${JSON.stringify(result)}`);
  });

  // await expressLoader({ app: expressApp });
  // console.log('Express Intialized');
 
  // ... more loaders can be here
};
