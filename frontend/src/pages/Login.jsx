import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, verifyOtp, resendOtp } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const { loading, isAuthenticated, isVerified } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Send as JSON object, not FormData
    const loginData = {
      email: email.trim(),
      password: password
    };

    try {
      const loginResponse = await dispatch(login(loginData));

      // Check if verification is required
      if (loginResponse?.payload?.requiresVerification) {
        setShowOtpInput(true);
        
        // In development, show OTP if email failed
        if (loginResponse?.payload?.devOtp) {
          toast.info(`Development Mode: OTP is ${loginResponse.payload.devOtp}`, {
            autoClose: 10000,
          });
          console.log("🔑 Development OTP:", loginResponse.payload.devOtp);
        } else {
          toast.info("Please enter the OTP sent to your email to verify your account.");
        }
        
        if (loginResponse?.payload?.emailError) {
          toast.warning("Email sending failed. Check console for OTP.");
          console.error("Email Error:", loginResponse.payload.emailError);
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
      const verifyResponse = await dispatch(verifyOtp({ email: email.trim(), otp: otp.trim() }));
      
      if (verifyResponse?.payload?.success) {
        // OTP verified successfully, user is now logged in
        setShowOtpInput(false);
        setOtp("");
        toast.success("Account verified successfully!");
      }
    } catch (error) {
      // Error is already handled in the slice
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp(email.trim()));
    } catch (error) {
      // Error is already handled in the slice
    }
  };

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigateTo("/");
    }
  }, [isAuthenticated, isVerified, navigateTo]);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md sm:w-[600px] sm:h-[450px]">
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            {showOtpInput ? "Verify Account" : "Login"}
          </h1>
          
          {!showOtpInput ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-stone-500">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-stone-500">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                  required
                />
              </div>
              <button
                className="bg-[#d6482b] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-xl py-2 px-4 rounded-md text-white mx-auto my-4"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
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
                  OTP sent to: {email}
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
                }}
                className="text-stone-500 hover:text-stone-700 text-sm mx-auto"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Login;