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

// delete store
storeRouter.post(
  "/delete/:id",
  storeController.validateDeleteStore,
  storeController.deleteStore
);

// get edit store
storeRouter.get("/edit/:id", storeController.getEditStoreForm);

// update store
storeRouter.post(
  "/edit/:id",
  storeController.validateNewStore,
  storeController.postEditStore
);

// get store items
storeRouter.get("/view/:id", storeController.getStoreInventory);

module.exports = storeRouter;
