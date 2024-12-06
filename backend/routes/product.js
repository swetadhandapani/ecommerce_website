const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController.js");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate.js");

const multer = require("multer");
const path = require("path");

/*const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads/product"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product'); // Change to your desired directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// File filter to check for valid image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});


router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(isAuthenticatedUser, createReview);

//Admin Routes
router.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images"), newProduct);
/*router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"),upload.array("images") ,newProduct);*/
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"),upload.array("images"), updateProduct);
router.route("/admin/reviews").get(isAuthenticatedUser, authorizeRoles("admin"),getReviews);
router.route("/admin/review").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteReview);

module.exports = router;
