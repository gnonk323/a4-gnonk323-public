import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB!;

if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable.");
if (!DB_NAME) throw new Error("Please define the MONGODB_DB environment variable.");

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  cachedClient = client;
  return client;
}