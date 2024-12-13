const {
  getAllCategories,
  getAllSuppliers,
  getAllProductsWithCategoryAndSupplier,
  getSearchItems,
  getTotalPages,
  getCountTotalSearchItems,
  createProduct,
  getItemById,
  removeProduct,
} = require("../db/db_utilities");
const { body, validationResult } = require("express-validator");
const { getArrayOfIdAndName } = require("../public/js/utilities.js");

const validateNewProduct = [
  body("productName")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Product name is required"),
  body("productPrice")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("image").optional(),
  body("category").notEmpty().withMessage("Category is required"),
  body("supplier").notEmpty().withMessage("Supplier is required"),
  body("description").optional(),
];

const getProducts = async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let currentPage = parseInt(page);

  // console.log(req.query);
  // if there are query parameters, redirect to the search route
  if (Object.keys(req.query).length > 0) {
    return next();
  }

  let products = await getAllProductsWithCategoryAndSupplier(page, limit);
  let totalPages = await getTotalPages();

  // get array of categories.name and categories_id
  // let categories = getArrayOfIdAndName(products, "category_id", "category");
  let categories = await getAllCategories();

  // get array of suppliers.name and suppliers_id
  // let suppliers = getArrayOfIdAndName(products, "supplier_id", "supplier");
  let suppliers = await getAllSuppliers();

  res.render("products", {
    categories,
    suppliers,
    products,
    query: req.query,
    currentPage: currentPage,
    totalPages: totalPages,
  });
};

const getSearchProducts = async (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let currentPage = parseInt(page);

  const products = await getSearchItems(req.query, currentPage, limit);

  let allProducts = await getAllProductsWithCategoryAndSupplier();
  let totalPages = await getCountTotalSearchItems(req.query);

  // get array of distinct categories.name and categories_id from all products
  // let categories = getArrayOfIdAndName(allProducts, "category_id", "category");
  let categories = await getAllCategories();

  // get array of distinct suppliers.name and suppliers_id
  // let suppliers = getArrayOfIdAndName(allProducts, "supplier_id", "supplier");
  let suppliers = await getAllSuppliers();

  res.render("products", {
    categories,
    suppliers,
    products,
    query: req.query,
    currentPage: currentPage,
    totalPages: totalPages,
  });
};

const getNewProduct = async (req, res) => {
  let allProducts = await getAllProductsWithCategoryAndSupplier();

  // get array of distinct categories.name and categories_id from all products
  let categories = getArrayOfIdAndName(allProducts, "category_id", "category");

  // get array of distinct suppliers.name and suppliers_id
  let suppliers = getArrayOfIdAndName(allProducts, "supplier_id", "supplier");

  res.render("new", { categories, suppliers });
};

const postNewProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    productName,
    productPrice,
    quantity,
    category,
    supplier,
    description,
  } = req.body;

  // Handle optional image upload
  let base64Image = null;
  if (req.file) {
    // Just convert the buffer to base64, don't add the prefix
    base64Image = req.file.buffer.toString("base64");
  }

  const product = await createProduct(
    productName,
    productPrice,
    quantity,
    category,
    supplier,
    description,
    base64Image
  );

  let totalPages = await getTotalPages();

  // redirect to the last page
  res.redirect(`/products?page=${totalPages}`);
};

const getProductById = async (req, res) => {
  const product = await getItemById(req.params.id);
  res.render("productDetails", { product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { deletePassword } = req.body;

  if (!deletePassword) {
    return res.status(400).send("Password is required");
  }

  if (deletePassword === process.env.ADMIN_PASSWORD) {
    await removeProduct(id);

    // get current page
    let currentPage = req.query.page || 1;

    res.redirect(`/products?page=${currentPage}`);
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  getProducts,
  getSearchProducts,
  getNewProduct,
  postNewProduct,
  validateNewProduct,
  getProductById,
  deleteProduct,
};
