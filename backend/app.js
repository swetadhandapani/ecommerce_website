const express = require('express');
const app = express();
const errorMiddleware = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")});


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname,"uploads")));


const products = require('./routes/product.js');
const auth = require('./routes/auth.js');
const order = require('./routes/order.js');
const payment = require('./routes/payment.js');

app.use('/api/v1/', products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order);
app.use('/api/v1/',payment);

app.use(errorMiddleware)

module.exports = app;