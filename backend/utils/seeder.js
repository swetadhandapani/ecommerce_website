const products = require("../data/product.json");
const Product = require("../models/productModel");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database.js");

dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const seedProducts = async () => {
    try{
        await Product.deleteMany();
        console.log("All products deleted!");
        await Product.insertMany(products);
        console.log("All products added!");
    }catch(error){
        console.error(error.message);
    }
    process.exit();
}

seedProducts();