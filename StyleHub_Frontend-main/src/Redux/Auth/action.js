import axios from "axios";
import { authActions } from "./reducer";
import api, { API_BASE_URL } from "../../config/api";

export const registerUser = (userData) => async (dispatch) => {
  dispatch(authActions.requestStart());
  console.log("auth action - ", userData);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      userData.userData
    );
    const user = response.data;
    if (user.data?.jwt) {
      localStorage.setItem("jwt", user.data.jwt);
      userData.navigate("/");
    }
    console.log("registerr :- ", user);
    dispatch(authActions.registerSuccess(user));
  } catch (error) {
    console.log("error ", error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Registration failed";
    dispatch(authActions.requestFailure(errorMessage));
  }
};

export const loginUser = (userData) => async (dispatch) => {
  dispatch(authActions.requestStart());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      userData.data
    );
    const user = response.data;
    if (user.data?.jwt) {
      localStorage.setItem("jwt", user.data.jwt);
      if (user.data?.role === "ROLE_ADMIN") {
        userData.navigate("/admin");
      } else if (user.data?.role === "ROLE_SALON_OWNER") {
        userData.navigate("/salon-dashboard");
      } else {
        userData.navigate("/");
      }
    }

    console.log("login ", user);
    dispatch(authActions.loginSuccess(user));
  } catch (error) {
    console.log("error ", error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Login failed";
    dispatch(authActions.requestFailure(errorMessage));
  }
};

export const getAllCustomers = (token) => async (dispatch) => {
  console.log("jwt - ", token);
  dispatch(authActions.requestStart());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = response.data;
    dispatch(authActions.getAllCustomersSuccess(users));
    console.log("All Customers", users);
  } catch (error) {
    console.log(error);
    dispatch(authActions.requestFailure(error.message || error));
  }
};

export const getUser = (token) => async (dispatch) => {
  dispatch(authActions.requestStart());
  try {
    const response = await api.get(`/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;
    dispatch(authActions.getUserSuccess(user));
    console.log("req User ", user);
  } catch (error) {
    dispatch(authActions.requestFailure(error.message || error));
  }
};

export const logout = () => async (dispatch) => {
  localStorage.clear();
  dispatch(authActions.logout());
};
