const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js")
const catchAsyncError = require("../middleware/catchAsyncError.js")
const APIFeatures = require("../utils/apiFeatures.js")

//Get All Products - http://localhost:8000/api/v1/products
//http://localhost:8000/api/v1/products?keyword=organic
exports.getProducts = async (req,res,next) => {
    const resPerPage = 3;
    

    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }

    const filterdProductsCount = await buildQuery().query.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if(filterdProductsCount !== totalProductsCount) {
        productsCount = filterdProductsCount;

    }

    const products = await buildQuery().paginate(resPerPage).query;
    //await new Promise(resolve => setTimeout(resolve, 3000))               delay for 3seconds(loader)
    //return next(new ErrorHandler("Unable to send products!", 400))
    
    res.status(200).json({
        success: true,
        count: filterdProductsCount,
        resPerPage,
        products
    })
}
//Create Product - http://localhost:8000/api/v1/product/new
  /*exports.newProduct = async (req, res) => {
    try {
      console.log('Request body:', req.body); // Log body content
      console.log('Uploaded files:', req.files); // Log uploaded files
  
      const productData = req.body;
  
      if (req.files) {
        productData.images = req.files.map(file => file.path); // Ensure this matches multer's output
      }
  
      const product = new Product(productData);
      await product.save();
  
      res.status(201).json({ success: true, product });
    } catch (error) {
      console.error('Error creating product:', error); // Log the full error stack
      res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  };*/
 
 /* exports.newProduct = async (req, res) => {

    try {
      const productData = req.body;
  
      // Check if files are properly attached
      if (req.files) {
        productData.images = req.files.map((file) => file.path); // Ensure paths are correctly saved
      }
  
      // Check if required fields are missing
      const requiredFields = ["name", "price", "description", "category", "seller"];
      const missingFields = requiredFields.filter((field) => !productData[field]);
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
  
      // Save the new product
      const product = new Product(productData);
      await product.save();
  
      // Send response
      res.status(201).json({ success: true, product });
    } catch (error) {
      console.error("Error creating product:", error); // Log the error for debugging
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  };
  */
 exports.newProduct = catchAsyncError(async(req,res,next)=>{
    let images = [];

    if(req.files.length > 0){
        req.files.forEach(file => {
            let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
            images.push({image:url})
        })
    }
    req.body.images = images;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
 })

// Get Single Product - http://localhost:8000/api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("reviews.user", "name email");

        if (!product) {
            // Product not found, send a 404 response
            return next(new ErrorHandler("Product not found", 404));
        }

        // Product found, send a 200 response
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // Handle potential errors, such as invalid ObjectId format
        next(new ErrorHandler("Server error, please try again later", 500));
    }
};


//Update Product - http://localhost:8000/api/v1/product/:id
/*exports.updateProduct = async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    //uploading images
    let images = [];
    //if images not cleared we keep existing images
    if(req.body.imagesCleared === "false"){
        images = product.images;
    }

    if(req.files.length > 0){
        req.files.forEach(file => {
            let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
            images.push({image:url})
        })
    }
    req.body.images = images;

    if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
}*/
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Handling images
        let images = [];
        if (req.body.imagesCleared === "false") {
            images = product.images;
        }

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
                let public_id = file.filename; // Assuming filename is used as public_id
                images.push({ public_id, url });
            });
        }

        req.body.images = images;

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



//Delete Product - http://localhost:8000/api/v1/product/:id
exports.deleteProduct = async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await Product.deleteOne({ _id: product._id });

    res.status(200).json({
        success: true,
        message: "Product deleted"
    })
}

//Create Review - http://localhost:8000/api/v1/review
 exports.createReview = catchAsyncError(async (req,res,next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    };
    
    const product = await Product.findById(productId);
    //finding user review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //Updating the review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.rating = rating;
                review.comment = comment;
            }
        })
    }else{//Creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings
    
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        message: "Review created",
        review
    })    
});

//Get reviews - http://localhost:8000/api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user", "name email");
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete Review -  http://localhost:8000/api/v1/review
exports.deleteReview = catchAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.query.productId);
    //Filtering the reviews which does not match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });
    //Number of reviews
    const numOfReviews = reviews.length;
    //Finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;
    //Save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true,
        message: "Review deleted"
    })
})

//get admin products - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req,res,next)=> {
    const products=await Product.find();
    res.status(200).send({
        success:true,
        products
    })
})