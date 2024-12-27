import "./App.css";
import axios from "axios";
import Home from "./components/Home.js";
import Footer from "./components/layouts/Footer.js";
import Header from "./components/layouts/Header.js";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import ProductDetail from "./components/product/ProductDetail.js";
import ProductSearch from "./components/product/ProductSearch.js";
import Login from "./components/user/Login.js";
import Register from "./components/user/Register.js";
import { useEffect, useState } from "react";
import store from "./store.js";
import { loadUser } from "./actions/userActions.js";
import Profile from "./components/user/Profile.js";
import ProtectedRoute from "./components/route/ProtectedRoute.js";
import UpdateProfile from "./components/user/UpdateProfile.js";
import UpdatePassword from "./components/user/UpdatePassword.js";
import ForgotPassword from "./components/user/ForgotPassword.js";
import ResetPassword from "./components/user/ResetPassword.js";
import Cart from "./components/cart/Cart.js";
import Shipping from "./components/cart/Shipping.js";
import ConfirmOrder from "./components/cart/ConfirmOrder.js";
import Payment from "./components/cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess.js";
import UserOrders from "./components/order/UserOrders.js";
import OrderDetail from "./components/order/OrderDetail.js";
import Dashboard from "./components/admin/Dashboard.js";
import ProductList from "./components/admin/ProductList.js";
import NewProduct from "./components/admin/NewProduct.js";
import UpdateProduct from "./components/admin/UpdateProduct.js";
import OrderList from "./components/admin/OrderList.js";
import UpdateOrder from "./components/admin/UpdateOrder.js"
import UserList from "./components/admin/UserList.js";
import UpdateUser from "./components/admin/UpdateUser.js";
import ReviewList from "./components/admin/ReviewList.js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    const getStripeApiKey = async () => {
      try {
        // If authentication is required, pass token in the headers
        const { data } = await axios.get("/api/v1/stripeapi", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
          },
        });
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      }
    };

    getStripeApiKey();
  }, []);

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className="container container-fluid">
            <ToastContainer theme="dark" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/myprofile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile/update"
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile/update/password"
                element={
                  <ProtectedRoute>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <Shipping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/confirm"
                element={
                  <ProtectedRoute>
                    <ConfirmOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <UserOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />

              {stripeApiKey && (
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Elements stripe={loadStripe(stripeApiKey)}>
                        <Payment />
                      </Elements>
                    </ProtectedRoute>
                  }
                />
              )}
            </Routes>
          </div>
          {/*Admin routes*/}
          <Routes>
          <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
          <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
          <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
          <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
          <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>} />

          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
