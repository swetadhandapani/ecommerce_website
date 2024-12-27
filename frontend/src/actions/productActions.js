import axios from "axios";
import {
  productsFail,
  productsRequest,
  productsSuccess,
  adminProductsFail,
  adminProductsSuccess,
  adminProductsRequest,
} from "../slices/productsSlice.js";
import {
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
  deleteProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  newProductFail,
  newProductRequest,
  newProductSuccess,
  productFail,
  productRequest,
  productSuccess,
  reviewsFail,
  reviewsRequest,
  reviewsSuccess,
  updateProductFail,
  updateProductRequest,
  updateProductSuccess,
} from "../slices/productSlice.js";

// Action creator for fetching products
export const getProducts =
  (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
      dispatch(productsRequest()); // Dispatch request action
      let link = `/api/v1/products?page=${currentPage}`;

      if (keyword) link += `&keyword=${keyword}`;
      if (price) link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      if (category) link += `&category=${category}`;
      if (rating) link += `&ratings=${rating}`;

      const { data } = await axios.get(link);
      dispatch(productsSuccess(data)); // Dispatch success action with data
    } catch (error) {
      let errorMessage = "Something went wrong"; // Default error message

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message; // Specific error message if available
      }

      dispatch(productsFail(errorMessage)); // Dispatch fail action with error message
    }
  };

// Action creator for fetching a single product
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest()); // Dispatch request action
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch(productSuccess(data)); // Dispatch success action with data
  } catch (error) {
    let errorMessage = "Something went wrong"; // Default error message

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message; // Specific error message if available
    }

    dispatch(productFail(errorMessage)); // Dispatch fail action with error message
  }
};

// Action creator for creating a review
export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest()); // Dispatch request action
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.put(`/api/v1/review`, reviewData, config);
    dispatch(createReviewSuccess(data)); // Dispatch success action with data
  } catch (error) {
    let errorMessage = "Something went wrong"; // Default error message

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message; // Specific error message if available
    }

    dispatch(createReviewFail(errorMessage)); // Dispatch fail action with error message
  }
};
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch(adminProductsRequest());
    const { data } = await axios.get("/api/v1/admin/products");
    dispatch(adminProductsSuccess(data));
  } catch (error) {
    let errorMessage = "Something went wrong";

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    dispatch(adminProductsFail(errorMessage));
  }
};

export const createNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());
    const { data } = await axios.post("/api/v1/admin/product/new", productData);
    dispatch(newProductSuccess(data));
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(newProductFail(errorMessage));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    await axios.delete(`/api/v1/admin/product/${id}`);
    dispatch(deleteProductSuccess());
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(deleteProductFail(errorMessage));
  }
};

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      productData
    );
    dispatch(updateProductSuccess(data));
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(updateProductFail(errorMessage));
  }
};
export const getReviews = (id) => async (dispatch) => {
  try {
    dispatch(reviewsRequest());
    const { data } = await axios.get(`/api/v1/admin/reviews`, { params: { id } });
    dispatch(reviewsSuccess(data));
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(reviewsFail(errorMessage));
  }
};
export const deleteReview = (productId,id) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());
   await axios.delete(`/api/v1/admin/review`, { params: { productId,id } });
    dispatch(deleteReviewSuccess());
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(deleteReviewFail(errorMessage));
  }
};
