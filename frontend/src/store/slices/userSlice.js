import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
    isVerified: false,
    error: null,
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isVerified = action.payload.user.isVerified;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      // state.isVerified = action.payload.user.isVerified;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    verifyOtpRequest(state, action) {
      state.loading = true;
    },
    verifyOtpSuccess(state, action) {
      state.loading = false;
      state.isVerified = true;
      state.user = action.payload.user;
    },
    verifyOtpFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    logoutSuccess(state, action) {
      state.isAuthenticated = false;
      state.isVerified = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.error = action.payload;
    },
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state, action) {
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
      state.leaderboard = state.leaderboard;
      state.loading = false;
      state.error = null;
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/register",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Don't set isAuthenticated to true - user needs to verify OTP first
    dispatch(userSlice.actions.registerFailed()); // Keep as not authenticated
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
    return { payload: response.data };
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    dispatch(userSlice.actions.clearAllErrors());
    throw error;
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/login",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if account requires verification
    if (response.data.requiresVerification || !response.data.user?.isVerified) {
      // Return response indicating verification is needed
      dispatch(userSlice.actions.loginFailed());
      return {
        payload: {
          requiresVerification: true,
          email: data.email,
          message: response.data.message || "Please verify your account with OTP.",
        },
      };
    }

    // User is verified, proceed with login
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
    return { payload: response.data };
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
    toast.error(errorMessage);
    dispatch(userSlice.actions.clearAllErrors());
    throw error;
  }
};

export const verifyOtp = (data) => async (dispatch) => {
  dispatch(userSlice.actions.verifyOtpRequest());
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/verify",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(userSlice.actions.verifyOtpSuccess(response.data));
    dispatch(userSlice.actions.loginSuccess(response.data)); // Update user state after verification
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
    return { payload: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "OTP verification failed.";
    dispatch(userSlice.actions.verifyOtpFailed(errorMessage));
    toast.error(errorMessage);
    dispatch(userSlice.actions.clearAllErrors());
    throw error;
  }
};

export const resendOtp = (email) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/resend-otp",
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    toast.success(response.data.message);
    return { payload: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to resend OTP.";
    toast.error(errorMessage);
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/users/logout",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/users/me",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/users/leaderboard",
      {
        withCredentials: true,
      }
    );
    dispatch(
      userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard)
    );
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export default userSlice.reducer;