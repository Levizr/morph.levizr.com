import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

function getCache(): MongooseCache {
  if (!global.__mongooseCache) {
    global.__mongooseCache = { conn: null, promise: null };
  }
  return global.__mongooseCache;
}

/** Connect to MongoDB (cached across hot-reloads / invocations). */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  const cache = getCache();
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((m) => m);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
