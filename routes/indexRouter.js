const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getDashboard);

indexRouter.get(
  "/total-quantity-each-item",
  indexController.getTotalQtyEachItem
);

module.exports = indexRouter;
