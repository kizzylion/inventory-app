const {
  getAllSuppliers,
  addSupplier,
  removeSupplier,
  updateSupplier,
  getSupplierById,
} = require("../db/db_utilities");
const { body, validationResult, check } = require("express-validator");

const validateNewSupplier = [
  body("supplierName").notEmpty().withMessage("Supplier name is required"),
  body("supplierEmail").isEmail().withMessage("Invalid email address"),
  body("supplierTel").isMobilePhone().withMessage("Invalid phone number"),
  body("supplierAddress")
    .notEmpty()
    .withMessage("Supplier address is required"),
];

const validateDeleteSupplier = [
  check("deletePassword").notEmpty().withMessage("Password is required"),
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

const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  const { deletePassword } = req.body;

  if (!deletePassword) {
    return res.status(400).send("Password is required");
  }

  if (deletePassword === process.env.ADMIN_PASSWORD) {
    await removeSupplier(id);
    res.redirect("/suppliers");
  } else {
    res.status(401).send("Unauthorized");
  }
};

const getEditSupplierForm = async (req, res) => {
  const { id } = req.params;
  const supplier = await getSupplierById(id);
  res.render("suppliers/editSupplier", { supplier });
};

const postEditSupplier = async (req, res) => {
  const { id } = req.params;
  const { supplierName, supplierEmail, supplierTel, supplierAddress } =
    req.body;
  await updateSupplier(
    id,
    supplierName,
    supplierEmail,
    supplierTel,
    supplierAddress
  );
  res.redirect("/suppliers");
};

module.exports = {
  getSuppliers,
  getNewSupplierForm,
  validateNewSupplier,
  validateDeleteSupplier,
  addNewSupplier,
  deleteSupplier,
  getEditSupplierForm,
  postEditSupplier,
};
