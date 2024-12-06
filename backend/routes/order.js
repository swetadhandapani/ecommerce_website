const express = require('express');
const router = express.Router();
const {newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require("../controllers/orderController.js");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/authenticate.js");


router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myorders").get(isAuthenticatedUser, myOrders);

//Admin routes
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), orders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);



module.exports = router;