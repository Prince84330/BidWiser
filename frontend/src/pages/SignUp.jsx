import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, verifyOtp, resendOtp } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [razorpayAccountNumber, setRazorpayAccountNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { loading, isAuthenticated, isVerified } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userName) return toast.error("Username is required.");
    if (!email) return toast.error("Email is required.");
    if (!phone) return toast.error("Phone number is required.");
    if (!password) return toast.error("Password is required.");
    if (!address) return toast.error("Address is required.");
    if (!role) return toast.error("Role is required.");
    if (!profileImage) return toast.error("Profile image is required.");
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email.toLowerCase());
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    role === "Auctioneer" &&
      (formData.append("bankAccountName", bankAccountName),
      formData.append("bankAccountNumber", bankAccountNumber),
      formData.append("bankName", bankName),
      formData.append("razorpayAccountNumber", razorpayAccountNumber),
      formData.append("paypalEmail", paypalEmail));
    
    try {
      const registerResponse = await dispatch(register(formData));
      
      // Show OTP input form after successful registration
      if (registerResponse?.payload?.success) {
        setRegisteredEmail(email.toLowerCase());
        setShowOtpInput(true);
        
        // In development, show OTP if email failed
        if (registerResponse?.payload?.devOtp) {
          toast.info(`Development Mode: OTP is ${registerResponse.payload.devOtp}`, {
            autoClose: 10000,
          });
          console.log("🔑 Development OTP:", registerResponse.payload.devOtp);
        } else {
          toast.info("Please check your email for OTP verification.");
        }
        
        if (registerResponse?.payload?.emailError) {
          toast.warning("Email sending failed. Check console for OTP.");
          console.error("Email Error:", registerResponse.payload.emailError);
        }
      }
    } catch (error) {
      // Error is already handled in the slice
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim() === "") {
      toast.error("Please enter the OTP.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const verifyResponse = await dispatch(verifyOtp({ 
        email: registeredEmail || email.toLowerCase(), 
        otp: otp.trim() 
      }));
      
      if (verifyResponse?.payload?.success) {
        // OTP verified successfully, user is now logged in
        setShowOtpInput(false);
        setOtp("");
        toast.success("Account verified successfully! Redirecting...");
        setTimeout(() => {
          navigateTo("/");
        }, 1500);
      }
    } catch (error) {
      // Error is already handled in the slice
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp(registeredEmail || email.toLowerCase()));
    } catch (error) {
      // Error is already handled in the slice
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated, navigateTo]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            {showOtpInput ? "Verify Account" : "Register"}
          </h1>
          
          {!showOtpInput ? (
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleRegister}
          >
            <p className="font-semibold text-xl md:text-2xl">
              Personal Details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Phone</label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Bidder">Bidder</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-1 gap-2">
              <label className="text-[16px] text-stone-600">
                Profile Image
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={
                    profileImagePreview
                      ? profileImagePreview
                      : "/imageHolder.jpg"
                  }
                  alt="profileImagePreview"
                  className="w-14 h-14 rounded-full"
                />
                <input type="file" onChange={imageHandler} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="font-semibold text-xl md:2xl flex flex-col">
                Payment Method Details{" "}
                <span className="text-[12px] text-stone-500">
                  Fill Payment Details Only If you are registering as an
                  Auctioneer
                </span>
              </label>
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-stone-500">
                  Bank Details
                </label>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  >
                    <option value="">Select Your Bank</option>
                    <option value="SBI Bank">SBI Bank</option>
                    <option value="PNB Bank">PNB Bank</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="Kotak Bank">Kotak Bank</option>
                  </select>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    placeholder="IBAN / IFSC"
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                  <input
                    type="text"
                    value={bankAccountName}
                    placeholder="Bank Account UserName"
                    onChange={(e) => setBankAccountName(e.target.value)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                </div>
              </div>
              <div>
                <label className="text-[16px] text-stone-600 font-semibold">
                  Razor Pay And Paypal Details
                </label>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <input
                    type="number"
                    value={razorpayAccountNumber}
                    placeholder="Easypaisa Account Number"
                    onChange={(e) => setRazorpayAccountNumber(e.target.value)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                  <input
                    type="email"
                    value={paypalEmail}
                    placeholder="Paypal Email"
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                </div>
              </div>
            </div>

            <button
              className="bg-[#d6482b] w-[420px] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-xl py-2 px-4 rounded-md text-white mx-auto lg:w-[640px] my-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-stone-500">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-stone-400 mt-1">
                  OTP sent to: {registeredEmail || email}
                </p>
                {import.meta.env.DEV && (
                  <p className="text-xs text-yellow-600 mt-1 bg-yellow-50 p-2 rounded">
                    💡 Development Mode: Check browser console or backend logs for OTP if email not received
                  </p>
                )}
              </div>
              <button
                className="bg-[#d6482b] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-xl py-2 px-4 rounded-md text-white mx-auto my-4"
                type="submit"
                disabled={verifyingOtp}
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#d6482b] hover:underline text-sm mx-auto"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp("");
                  navigateTo("/login");
                }}
                className="text-stone-500 hover:text-stone-700 text-sm mx-auto"
              >
                Verify Later (Go to Login)
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default SignUp;
