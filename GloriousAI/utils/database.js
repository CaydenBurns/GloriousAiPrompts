import mongoose from "mongoose";

let isConnencted = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);
  if (isConnencted) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sharePrompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnencted = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDBERROR", error);
  }
};
