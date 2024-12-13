const { getAllSuppliers, addSupplier } = require("../db/db_utilities");
const { body, validationResult } = require("express-validator");

const validateNewSupplier = [
  body("supplierName").notEmpty().withMessage("Supplier name is required"),
  body("supplierEmail").isEmail().withMessage("Invalid email address"),
  body("supplierTel").isMobilePhone().withMessage("Invalid phone number"),
  body("supplierAddress")
    .notEmpty()
    .withMessage("Supplier address is required"),
];

const getSuppliers = async (req, res) => {
  const suppliers = await getAllSuppliers();
  const search = req.query.search || "";
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("suppliers", {
    suppliers: filteredSuppliers,
    search,
    deletePassword: process.env.DELETE_PASSWORD,
  });
};

const getNewSupplierForm = (req, res) => {
  res.render("newSupplier");
};

const addNewSupplier = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { supplierName, supplierEmail, supplierTel, supplierAddress } =
    req.body;
  await addSupplier(supplierName, supplierEmail, supplierTel, supplierAddress);
  res.redirect("/suppliers");
};

module.exports = {
  getSuppliers,
  getNewSupplierForm,
  validateNewSupplier,
  addNewSupplier,
};
