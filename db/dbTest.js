import neo4j from "neo4j-driver";
import "dotenv/config";

async function testConnection() {
    const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

    let session;

    try {
        // Open a session
        session = driver.session();

        // Run a simple query that doesn't depend on data
        const result = await session.run("RETURN 1 AS number");

        // Log the result
        console.log(result.records[0].get("number")); // Should log: 1

        console.log("Connection successful!");
    } catch (error) {
        // Handle errors that occur during the connection or query execution
        console.error("Failed to connect to Neo4j:", error.message);
    } finally {
        // Always close the session and driver
        if (session) {
            await session.close();
        }

        await driver.close();
    }
}

// Call the function to test the connection
testConnection();
