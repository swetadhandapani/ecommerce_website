import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData.js";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart when the order is successful
    dispatch(clearCart());

    // Optionally, navigate to the home page or order details
    const timeout = setTimeout(() => {
      navigate("/");
    }, 7000);

    return () => clearTimeout(timeout);
  }, [dispatch, navigate]);
  return (
    <div className="row justify-content-center">
      <MetaData title={"Order Success"} />
      <div className="col-6 mt-5 text-center">
        <img
          className="my-5 img-fluid d-block mx-auto"
          src="/images/success.png"
          alt="Order Success"
          width="200"
          height="200"
        />

        <h2>Your Order has been placed successfully.</h2>

        <Link to="/orders" className="btn btn-primary mt-3">
          Go to Orders
        </Link>
      </div>
    </div>
  );
}
