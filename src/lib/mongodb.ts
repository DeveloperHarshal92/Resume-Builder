import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB Successfully");
  } catch (err) {
    console.log("Error in connecting DB", err);
  }
};
