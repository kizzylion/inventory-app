const { Router } = require("express");
const storeRouter = Router();
const storeController = require("../controllers/storesController");

storeRouter.get("/", storeController.getStore);

storeRouter.get("/new", storeController.getNewStoreForm);

storeRouter.post(
  "/new",
  storeController.validateNewStore,
  storeController.addNewStore
);

storeRouter.post(
  "/delete/:id",
  storeController.validateDeleteStore,
  storeController.deleteStore
);

module.exports = storeRouter;
