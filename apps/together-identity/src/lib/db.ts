import { MongoClient, type Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export { clientPromise };

export async function ensureIndexes(): Promise<void> {
  const db = await getDb();

  await db.collection("users").createIndexes([
    { key: { email: 1 }, unique: true, name: "email_unique" },
    { key: { username: 1 }, unique: true, sparse: true, name: "username_unique" },
  ]);

  await db.collection("sessions").createIndexes([
    { key: { userId: 1 }, name: "session_userId" },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: "session_ttl" },
  ]);

  await db.collection("accounts").createIndexes([
    { key: { userId: 1 }, name: "account_userId" },
    {
      key: { providerId: 1, accountId: 1 },
      unique: true,
      name: "account_provider_unique",
    },
  ]);

  await db.collection("verifications").createIndexes([
    { key: { identifier: 1 }, name: "verification_identifier" },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: "verification_ttl" },
  ]);
}
