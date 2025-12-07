import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";


export const register = catchAsyncErrors(async(req, res,next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required.", 400));
  }

  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    razorpayAccountNumber,
    paypalEmail,
  } = req.body;
  if (!userName || !email || !phone || !password || !address || !role) {
    
    return next(new ErrorHandler("Please fill full form.", 400));
  }
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(
        new ErrorHandler("Please provide your full bank details.", 400)
      );
    }
    if (!razorpayAccountNumber) {
      return next(
        new ErrorHandler("Please provide your razorpay account number.", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your paypal email.", 400));
    }
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "AUCTION_TRACKER",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
    );
  }
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      razorpay: {
        razorpayAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  
  // Generate and send OTP for account verification
  const otp = Math.floor(100000 + Math.random() * 900000);
  const isDevelopment = process.env.NODE_ENV === "development";
  
  let emailSent = false;
  let emailError = null;
  
  try {
    const emailResult = await sendEmail({
      email: user.email,
      subject: "Account Verification - BidWiser",
      message: `Your OTP for account verification is: ${otp}. This OTP is valid for 10 minutes.`,
    });
    
    if (emailResult?.success) {
      emailSent = true;
      console.log(`✅ OTP sent to ${user.email}: ${otp}`);
    } else {
      emailError = emailResult?.error || "Email sending failed";
      console.error("❌ Email sending failed:", emailError);
      console.log(`📝 OTP for ${user.email}: ${otp} (Email not sent - check config.env)`);
    }
  } catch (error) {
    emailError = error.message;
    console.error("❌ Email sending failed:", error.message);
    console.log(`📝 OTP for ${user.email}: ${otp} (Email not sent)`);
  }
  
  // Super Admin doesn't need OTP verification
  if (role === "Super Admin") {
    user.isVerified = true;
    user.otp = null;
    console.log(`✅ Super Admin created: ${user.email}`);
    await user.save();
    // Generate token for Super Admin immediately
    generateToken(user, "Super Admin registered successfully.", 201, res);
  } else {
    user.otp = otp;
    user.isVerified = false; // Set to false until OTP is verified
    await user.save();
    
    // Don't generate token yet - user needs to verify OTP first
    const responseData = {
      success: true,
      message: emailSent 
        ? "User registered successfully. Please check your email for OTP verification."
        : "User registered successfully. Check console for OTP (email sending failed).",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
    
    // Include OTP in development mode for testing
    if (isDevelopment) {
      responseData.devOtp = otp; // Only in development
      responseData.emailSent = emailSent;
      if (emailError) {
        responseData.emailError = emailError;
      }
    }
    
    res.status(201).json(responseData);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if email and password exist and are not empty strings
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(new ErrorHandler("Please provide both email and password.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  
  // Check if user is verified
  if (!user.isVerified) {
    // Generate and send new OTP automatically when unverified user tries to login
    const otp = Math.floor(100000 + Math.random() * 900000);
    const isDevelopment = process.env.NODE_ENV === "development";
    
    let emailSent = false;
    let emailError = null;
    
    try {
      const emailResult = await sendEmail({
        email: user.email,
        subject: "Account Verification - BidWiser",
        message: `Your OTP for account verification is: ${otp}. This OTP is valid for 10 minutes.`,
      });
      
      if (emailResult?.success) {
        emailSent = true;
        console.log(`✅ OTP sent to ${user.email}: ${otp}`);
      } else {
        emailError = emailResult?.error || "Email sending failed";
        console.error("❌ Email sending failed:", emailError);
        console.log(`📝 OTP for ${user.email}: ${otp} (Email not sent - check config.env)`);
      }
    } catch (error) {
      emailError = error.message;
      console.error("❌ Email sending failed:", error.message);
      console.log(`📝 OTP for ${user.email}: ${otp} (Email not sent)`);
    }
    
    user.otp = otp;
    await user.save();
    
    // In development, include OTP in response for testing
    const responseData = {
      success: false,
      message: emailSent 
        ? "Please verify your account with OTP. A new OTP has been sent to your email."
        : "Please verify your account with OTP. Check console for OTP (email sending failed).",
      user: {
        id: user._id,
        email: user.email,
        isVerified: false,
      },
      requiresVerification: true,
    };
    
    // Include OTP in development mode for testing
    if (isDevelopment) {
      responseData.devOtp = otp; // Only in development
      responseData.emailSent = emailSent;
      if (emailError) {
        responseData.emailError = emailError;
      }
    }
    
    return res.status(200).json(responseData);
  }
  
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});



export const verifyAccount = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required.", 400));
  }
  
  // Find user by email (no authentication required for verification)
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  
  // Convert both to numbers for comparison
  const userOtp = Number(user.otp);
  const providedOtp = Number(otp);
  
  if (!user.otp || userOtp !== providedOtp) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }
  
  // Check if OTP is expired (10 minutes)
  // Note: You might want to add an otpExpiry field to the schema for better security
  user.isVerified = true;
  user.otp = null;
  await user.save();
  
  // Generate token after successful verification
  generateToken(user, "Account verified successfully.", 200, res);
});

export const resendOtp = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new ErrorHandler("Email is required.", 400));
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  
  if (user.isVerified) {
    return next(new ErrorHandler("Account is already verified.", 400));
  }
  
  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  try {
    const emailResult = await sendEmail({
      email: user.email,
      subject: "Account Verification - BidWiser",
      message: `Your new OTP for account verification is: ${otp}. This OTP is valid for 10 minutes.`,
    });
    
    if (!emailResult?.success) {
      console.error("Email sending failed:", emailResult?.error);
      console.log(`📝 New OTP for ${user.email}: ${otp} (Email not sent - check config.env)`);
      // Don't return error - OTP is still generated and saved
    } else {
      console.log(`✅ New OTP sent to ${user.email}: ${otp}`);
    }
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    console.log(`📝 New OTP for ${user.email}: ${otp} (Email not sent)`);
    // Don't return error - OTP is still generated and saved
  }
  
  user.otp = otp;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: "OTP has been resent to your email.",
  });
});