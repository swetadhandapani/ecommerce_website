/*import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    isAuthenticated: false,
  },
  //Reducers
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    loginSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    registerRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    registerSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    loadUserRequest(state, action) {
      return {
        ...state,
        isAuthenticated: false,
        loading:true,
      };
    },
    loadUserSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loadUserFail(state, action) {
      return {
        ...state,
        loading: false,
        
      };
    },
    logoutSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: false,
      };
    },
    logoutFail(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
    updatePasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updatePasswordSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        isUpdated: true
      };
    },
    updatePasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUpdateProfile(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },
    
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        message: null
    
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message
        
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
    
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticated:true,
        user: action.payload.user
        
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateProfileRequest: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const { actions, reducer } = authSlice;

//actionCreators
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  clearUpdateProfile,
} = actions;

export default reducer;
*/
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: null,
    error: null,
    isUpdated: false,
    message: null,
  },
  reducers: {
    // Login Actions
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // Register Actions
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Load User Actions
    loadUserRequest(state) {
      state.loading = true;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loadUserFail(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Logout Actions
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFail(state, action) {
      state.error = action.payload;
    },

    // Update Profile Actions
    updateProfileRequest(state) {
      state.loading = true;
      state.isUpdated = false;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isUpdated = true;
    },
    updateProfileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Password Actions
    updatePasswordRequest(state) {
      state.loading = true;
      state.isUpdated = false;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Forgot Password Actions
    forgotPasswordRequest(state) {
      state.loading = true;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset Password Actions
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear Errors and Update Flags
    clearError(state) {
      state.error = null;
    },
    clearUpdateProfile(state) {
      state.isUpdated = false;
    },
  },
});

const { actions, reducer } = authSlice;

// Action Creators
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  clearUpdateProfile,
} = actions;

export default reducer;


