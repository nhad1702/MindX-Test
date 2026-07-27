import mongoose from "mongoose"

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is missing. Copy .env.example to .env.")
  mongoose.set("strictQuery", true)
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 })
  console.log("Connected to MongoDB")
}
