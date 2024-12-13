const { getAllStores, addStore, removeStore } = require("../db/db_utilities");

const { validationResult, body, check } = require("express-validator");

const validateNewStore = [
  body("storeName").notEmpty().withMessage("Name is required"),
  body("storeLocation").notEmpty().withMessage("Location is required"),
  body("storePhone").isMobilePhone().withMessage("Invalid phone number"),
  body("storeEmail").isEmail().withMessage("Invalid email address"),
];

const validateDeleteStore = [
  check("deletePassword").notEmpty().withMessage("Password is required"),
];

const getStore = async (req, res) => {
  const stores = await getAllStores();
  const search = req.query.search || "";
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("stores", {
    stores: filteredStores,
    search,
    deletePassword: process.env.DELETE_PASSWORD,
  });
};

const getNewStoreForm = (req, res) => {
  res.render("newStore");
};

const addNewStore = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { storeName, storeLocation, storePhone, storeEmail } = req.body;
  await addStore(storeName, storeLocation, storePhone, storeEmail);
  res.redirect("/stores");
};

const deleteStore = async (req, res) => {
  const { id } = req.params;
  const { deletePassword } = req.body;

  if (!deletePassword) {
    return res.status(400).send("Password is required");
  }

  if (deletePassword === process.env.ADMIN_PASSWORD) {
    await removeStore(id);
    res.redirect("/stores");
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  getStore,
  getNewStoreForm,
  addNewStore,
  validateNewStore,
  validateDeleteStore,
  deleteStore,
};
