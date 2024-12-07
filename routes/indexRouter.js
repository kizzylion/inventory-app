const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getDashboard);

indexRouter.get("/products", indexController.getProducts);

// handle product Search
indexRouter.get("/products", indexController.getSearchProducts);

module.exports = indexRouter;
