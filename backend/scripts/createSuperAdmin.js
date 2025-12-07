import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
config({ path: "./config/config.env" });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "AUCTION_TRACKER",
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create Super Admin
const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Get super admin details from command line arguments or use defaults
    const args = process.argv.slice(2);
    
    // Default values (you can modify these)
    const defaultData = {
      userName: "Super Admin",
      email: "bidwiser3@gmail.com",
      password: "Bidwiser@10",
      phone: "8433077508",
      address: "Admin Address",
      role: "Super Admin",
    };

    // Parse command line arguments
    const userData = {
      userName: args[0] || defaultData.userName,
      email: args[1] || defaultData.email,
      password: args[2] || defaultData.password,
      phone: args[3] || defaultData.phone,
      address: args[4] || defaultData.address,
      role: "Super Admin",
    };

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: userData.email },
        { role: "Super Admin" }
      ]
    });

    if (existingAdmin) {
      console.log("⚠️  Super Admin already exists!");
      console.log("   Email:", existingAdmin.email);
      console.log("   Role:", existingAdmin.role);
      process.exit(0);
    }

    // Create a default profile image URL (or you can upload one to Cloudinary)
    // For now, using a placeholder
    const defaultProfileImage = {
      public_id: "default_profile",
      url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-avatar.png"
    };

    // If Cloudinary is configured, you can upload an image
    // Otherwise, use placeholder
    let profileImage = defaultProfileImage;
    
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        
        // Upload a default image or use existing
        // For now, we'll use placeholder
        console.log("📸 Using default profile image (you can update later)");
      } catch (error) {
        console.log("⚠️  Cloudinary not configured, using placeholder image");
      }
    }

    // Create super admin user
    const superAdmin = await User.create({
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      profileImage: profileImage,
      isVerified: true, // Super Admin doesn't need OTP verification
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber: "",
          bankAccountName: "",
          bankName: "",
        },
        razorpay: {
          razorpayAccountNumber: 0,
        },
        paypal: {
          paypalEmail: "",
        },
      },
    });

    console.log("\n✅ Super Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", superAdmin.email);
    console.log("👤 Username:", superAdmin.userName);
    console.log("🔑 Password:", userData.password);
    console.log("👑 Role:", superAdmin.role);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Save these credentials securely!");
    console.log("   You can now login with these credentials.");
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error.message);
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();

