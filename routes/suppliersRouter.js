const { Router } = require("express");
const suppliersRouter = Router();
const suppliersController = require("../controllers/suppliersController");
const {
  validateNewSupplier,
  validateDeleteSupplier,
} = require("../controllers/suppliersController");

suppliersRouter.get("/", suppliersController.getSuppliers);

// add new supplier form
suppliersRouter.get("/new", suppliersController.getNewSupplierForm);

// add new supplier
suppliersRouter.post(
  "/new",
  validateNewSupplier,
  suppliersController.addNewSupplier
);

// delete supplier
suppliersRouter.post(
  "/delete/:id",
  validateDeleteSupplier,
  suppliersController.deleteSupplier
);

// edit supplier
suppliersRouter.get("/edit/:id", suppliersController.getEditSupplierForm);

// update supplier
suppliersRouter.post(
  "/edit/:id",
  validateNewSupplier,
  suppliersController.postEditSupplier
);

module.exports = suppliersRouter;
