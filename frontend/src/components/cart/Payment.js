import { useElements, useStripe } from "@stripe/react-stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "../cart/Shipping.js";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice.js";
import { createOrder } from "../../actions/orderActions.js";
import { clearError as clearOrderError } from "../../slices/orderSlice.js";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { error: orderError } = useSelector((state) => state.orderState);

  const { user } = useSelector((state) => state.authState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );

  // Check if shippingInfo is available before creating paymentData and order
  const paymentData = shippingInfo && orderInfo
    ? {
        amount: Math.round(orderInfo.totalPrice * 100),
        shipping: {
          name: user.name,
          address: {
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode,
            country: shippingInfo.country,
            state: shippingInfo.state,
            line1: shippingInfo.address,
          },
          phone: shippingInfo.phoneNo,
        },
      }
    : null;

  const order = shippingInfo && orderInfo
    ? {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
      }
    : null;

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
    if (orderError) {
      toast(orderError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearOrderError());
        },
      });
    }
  }, [shippingInfo, navigate, orderError, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;

    // Ensure paymentData is defined before proceeding
    if (!paymentData) {
      toast("Shipping information is incomplete.", {
        type: "error",
        position: "bottom-center",
      });
      document.querySelector("#pay_btn").disabled = false;
      return;
    }

    try {
      const { data } = await axios.post(`/api/v1/payment/process`, paymentData);
      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        toast(result.error.message, {
          type: "error",
          position: "bottom-center",
        });
        document.querySelector("#pay_btn").disabled = false;
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast("Payment Success!", {
            type: "success",
            position: "bottom-center",
          });

          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(orderCompleted());
          dispatch(createOrder(order));
          navigate("/order/success");
        } else {
          toast("Please try again!", {
            type: "warning",
            position: "bottom-center",
          });
          document.querySelector("#pay_btn").disabled = false;
        }
      }
    } catch (error) {
      toast("Payment failed! Please try again.", {
        type: "error",
        position: "bottom-center",
      });
      document.querySelector("#pay_btn").disabled = false;
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>
          <div className="form-group">
            <label htmlFor="card_num_field">Card Number</label>
            <CardNumberElement id="card_num_field" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="card_exp_field">Card Expiry</label>
            <CardExpiryElement id="card_exp_field" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="card_cvc_field">Card CVC</label>
            <CardCvcElement id="card_cvc_field" className="form-control" />
          </div>

          <button
            id="pay_btn"
            type="submit"
            className="btn btn-block py-3"
            disabled={!orderInfo}
          >
            Pay {orderInfo ? `$${orderInfo.totalPrice}` : ""}
          </button>
        </form>
      </div>
    </div>
  );
}
