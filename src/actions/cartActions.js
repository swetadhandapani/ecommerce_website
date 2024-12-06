import {addCartItemRequest, addCartItemSuccess} from "../slices/cartSlice.js";
import axios from "axios";

export const addCartItem = (id, quantity) => async (dispatch) => {
    try {
        dispatch(addCartItemRequest());
        const { data } = await axios.get(`/api/v1/product/${id}`);
        dispatch(addCartItemSuccess({
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].image,
            stock: data.product.stock,
            quantity,
        }));
    } catch (error) {
        // Handle the error (e.g., dispatch a failure action)
        console.error("Error adding cart item:", error);
    }
};
