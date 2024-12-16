const { Router } = require("express");
const itemMovementsRouter = Router();
const itemMovementsController = require("../controllers/itemMovementsController");

itemMovementsRouter.get("/", itemMovementsController.getAllItemActivity);

itemMovementsRouter.get("/new", itemMovementsController.getNewItemMovementForm);

module.exports = itemMovementsRouter;
