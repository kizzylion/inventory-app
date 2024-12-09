const { Router } = require("express");
const productRouter = Router();
const productsController = require("../controllers/productsController");
const { validateNewProduct } = require("../controllers/productsController");

productRouter.get("/", productsController.getProducts);

// handle product Search
productRouter.get("/", productsController.getSearchProducts);

productRouter.get("/new", productsController.getNewProduct);

productRouter.post(
  "/new",
  validateNewProduct,
  productsController.postNewProduct
);

module.exports = productRouter;
