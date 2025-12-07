import mongoose from "mongoose";

export const connection = () => {
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables!");
    console.error("Please check your config/config.env file and ensure MONGO_URI is set.");
    process.exit(1);
  }

  // Validate MongoDB URI format
  if (!process.env.MONGO_URI.startsWith("mongodb://") && !process.env.MONGO_URI.startsWith("mongodb+srv://")) {
    console.error("❌ Invalid MONGO_URI format!");
    console.error("MONGO_URI should start with 'mongodb://' or 'mongodb+srv://'");
    console.error("Current value starts with:", process.env.MONGO_URI.substring(0, 20) + "...");
    process.exit(1);
  }

  const options = {
    dbName: "AUCTION_TRACKER",
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  };

  mongoose
    .connect(process.env.MONGO_URI, options)
    .then(() => {
      console.log("✅ Connected to MongoDB successfully!");
      console.log("📊 Database:", options.dbName);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:");
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      
      if (err.name === "MongoServerSelectionError" || err.message.includes("ENOTFOUND")) {
        console.error("\n🔍 Troubleshooting steps:");
        console.error("1. Check if your MONGO_URI in config/config.env is correct");
        console.error("2. Verify your MongoDB Atlas cluster is running");
        console.error("3. Check if your IP address is whitelisted in MongoDB Atlas");
        console.error("4. Verify your MongoDB username and password are correct");
        console.error("5. Ensure your internet connection is working");
        console.error("\n📝 MongoDB URI format should be:");
        console.error("   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority");
      }
      
      process.exit(1);
    });
};
