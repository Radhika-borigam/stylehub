import api from "../../config/api";
import { categoryActions } from "./reducer";

const BASE_URL = "/api/categories";

export const createCategory = ({ category, jwt }) => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    const config = { headers: { Authorization: `Bearer ${jwt}` } };
    const response = await api.post(`${BASE_URL}/salon-owner`, category, config);
    console.log("created category", response.data);
    dispatch(categoryActions.createCategorySuccess(response.data));
  } catch (error) {
    console.log("error creating category", error);
    dispatch(categoryActions.requestFailure(error.response?.data || "Error creating category"));
  }
};

export const getAllCategories = () => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    const response = await api.get(BASE_URL);
    dispatch(categoryActions.fetchCategoriesSuccess(response.data));
  } catch (error) {
    dispatch(categoryActions.requestFailure(error.response?.data || "Error fetching categories"));
  }
};

export const getCategoriesBySalon = ({jwt, salonId}) => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    };
    const response = await api.get(`${BASE_URL}/salon/${salonId}`, config);
    dispatch(categoryActions.fetchCategoriesSuccess(response.data));
    console.log("response + ", response.data);
  } catch (error) {
    console.log("error getting salon categories", error);
    dispatch(categoryActions.requestFailure(error.response?.data || "Error fetching salon categories"));
  }
};

export const getCategoryById = (id) => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    const response = await api.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch(categoryActions.fetchCategoryByIdSuccess(response.data));
    console.log("response get category by id ", response.data);
  } catch (error) {
    dispatch(categoryActions.requestFailure(error.response?.data || "Error fetching category"));
  }
};

export const updateCategory = ({id, category}) => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    const token = localStorage.getItem("jwt"); 
    const response = await api.patch(
      `/api/categories/${id}`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    dispatch(categoryActions.updateCategorySuccess(response.data));
  } catch (error) {
    dispatch(categoryActions.requestFailure(error.response?.data || "Failed to update category"));
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  dispatch(categoryActions.requestStart());
  try {
    await api.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch(categoryActions.deleteCategorySuccess(id));
  } catch (error) {
    dispatch(categoryActions.requestFailure(error.response?.data || "Error deleting category"));
  }
};
