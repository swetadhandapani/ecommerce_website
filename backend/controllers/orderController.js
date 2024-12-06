const catchAsyncError = require("../middleware/catchAsyncError.js");
const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

//Create new order - http://localhost:8000/api/v1/order/new
exports.newOrder = catchAsyncError(async(req,res,next)=> {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    })
})

//Get single order - http://localhost:8000/api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order
    })
});

//Get Loggedin user orders - http://localhost:8000/api/v1/myorders
exports.myOrders = catchAsyncError(async(req,res,next) => {
    const orders = await Order.find({user: req.user.id});
    
    res.status(200).json({
        success: true,
        orders
    })
});

//Admin: Get all orders - http://localhost:8000/api/v1/orders
exports.orders = catchAsyncError(async(req,res,next) => {
    const orders = await Order.find({user: req.user.id});

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
});

//Admin: Update order/order status - http://localhost:8000/api/v1/admin/order/:id
 exports.updateOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Order has been already delivered!", 400));
    }
    //Updating the product stock of each order item
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    })
});

async function updateStock(productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false});
}

//Admin: Delete order - http://localhost:8000/api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }
    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });

})