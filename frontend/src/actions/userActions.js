import {
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
  forgotPasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  resetPasswordFail,
  resetPasswordSuccess,
  resetPasswordRequest,
} from "../slices/authSlice.js";
import axios from "axios";
import { deleteUserFail, deleteUserRequest, deleteUserSuccess, updateUserFail, updateUserRequest, updateUserSuccess, userFail, userRequest, usersFail, usersRequest, usersSuccess, userSuccess } from "../slices/userSlice.js";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/api/v1/login`, { email, password });
    dispatch(loginSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(loginFail(errorMessage));
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(`/api/v1/register`, userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(registerFail(errorMessage));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`/api/v1/myprofile`);
    dispatch(loadUserSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(loadUserFail(errorMessage));
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`);
    dispatch(logoutSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(logoutFail(errorMessage));
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const { data } = await axios.put(`/api/v1/update`, userData, config);
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(updateProfileFail(errorMessage));
  }
};

export const updatePassword = (formData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/password/change`, formData, config);
    dispatch(updatePasswordSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(updatePasswordFail(errorMessage));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/forgot`,
      formData,
      config
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(forgotPasswordFail(errorMessage));
  }
};

export const resetPassword = (formData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/reset/${token}`,
      formData,
      config
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(resetPasswordFail(errorMessage));
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(usersRequest());
    const { data } = await axios.get(`/api/v1/admin/users`);
    dispatch(usersSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(usersFail(errorMessage));
  }
};
export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    dispatch(userSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(userFail(errorMessage));
  }
};
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
   await axios.delete(`/api/v1/admin/user/${id}`);
    dispatch(deleteUserSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(deleteUserFail(errorMessage));
  }
};
export const updateUser = (id,formData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/admin/user/${id}`, formData, config);
    dispatch(updateUserSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(updateUserFail(errorMessage));
  }
};