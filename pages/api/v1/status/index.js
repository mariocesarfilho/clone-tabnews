import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbValueResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbValueResult.rows[0].server_version;

  const dbMaxConnection = await database.query("SHOW max_connections;");
  const dbMaxConnectionValue = dbMaxConnection.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseConnectionsResult.rows[0].count;

  console.log(databaseOpenedConnectionsValue);

  response.status(200).json({
    update_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnectionValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
