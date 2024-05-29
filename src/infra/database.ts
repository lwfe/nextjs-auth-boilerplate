import { Client, QueryConfig } from "pg";

async function query(queryObject: QueryConfig) {
  let client: Client | undefined;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (err: any) {
    console.error(err);
  } finally {
    if (client) await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

function getSSLValues() {
  return process.env.NODE_ENV === "production" ? true : false;
}

export default Object.freeze({
  query,
  getNewClient,
});
