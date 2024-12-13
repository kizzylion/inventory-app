const { Router } = require("express");
const productRouter = Router();
const productsController = require("../controllers/productsController");
const { validateNewProduct } = require("../controllers/productsController");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      req.file = file;
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

productRouter.get("/", productsController.getProducts);

// handle product Search
productRouter.get("/", productsController.getSearchProducts);

productRouter.get("/new", productsController.getNewProduct);

productRouter.get("/view/:id", productsController.getProductById);

productRouter.post(
  "/new",
  upload.single("image"),
  validateNewProduct,
  productsController.postNewProduct
);

productRouter.get("/edit/:id", productsController.getEditProduct);

productRouter.post(
  "/edit/:id",
  upload.single("image"),
  validateNewProduct,
  productsController.postEditProduct
);

module.exports = productRouter;
