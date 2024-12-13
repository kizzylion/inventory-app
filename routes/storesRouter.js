const { Router } = require("express");
const storeRouter = Router();
const storeController = require("../controllers/storesController");

storeRouter.get("/", storeController.getStore);

storeRouter.get("/new", storeController.getNewStoreForm);

storeRouter.post("/new", storeController.addStoreController);

module.exports = storeRouter;
