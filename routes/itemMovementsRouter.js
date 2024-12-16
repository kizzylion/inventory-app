const { Router } = require("express");
const itemMovementsRouter = Router();
const itemMovementsController = require("../controllers/itemMovementsController");

itemMovementsRouter.get("/", itemMovementsController.getAllItemActivity);

itemMovementsRouter.get("/new", itemMovementsController.getNewItemMovementForm);

itemMovementsRouter.post("/new", itemMovementsController.addNewItemMovement);

module.exports = itemMovementsRouter;
