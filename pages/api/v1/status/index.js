import database from "infra/database.js"

async function status(request, response) {
    const updatedAt = new Date().toISOString();

    const dbValueResult = await database.query("SHOW server_version;");
    const dbVersionValue = dbValueResult.rows[0].server_version;

    const dbMaxConnection = await database.query("SHOW max_connections;");
    const dbMaxConnectionValue = dbMaxConnection.rows[0].max_connections;

    const dbOpenedConnectionResult = await database.query("SELECT * pg_stat_activity");
    // console.log(dbOpenedConnectionResult);

    console.log("Response Status: " ,response.status);

    response.status(200).json({
        update_at: updatedAt,
        dependencies: {
            database: {
                version: dbVersionValue,
                max_connections: parseInt(dbMaxConnectionValue),
            },
        },
    });
        
};

export default status;