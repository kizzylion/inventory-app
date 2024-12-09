const {
  getAllProductsWithCategoryAndSupplier,
  getSearchItems,
  getTotalPages,
  getCountTotalSearchItems,
} = require("../db/db_utilities");
const { getArrayOfIdAndName } = require("../public/js/utilities.mjs");

const { route } = require("../routes/indexRouter");

const getDashboard = (req, res) => {
  res.render("index");
};

const getProducts = async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let currentPage = parseInt(page);

  // console.log(req.query);
  // if there are query parameters, redirect to the search route
  if (Object.keys(req.query).length > 0) {
    return next(route);
  }

  let products = await getAllProductsWithCategoryAndSupplier(page, limit);
  let totalPages = await getTotalPages();

  // get array of categories.name and categories_id
  let categories = getArrayOfIdAndName(products, "category_id", "category");

  // get array of suppliers.name and suppliers_id
  let suppliers = getArrayOfIdAndName(products, "supplier_id", "supplier");

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
  let categories = getArrayOfIdAndName(allProducts, "category_id", "category");

  // get array of distinct suppliers.name and suppliers_id
  let suppliers = getArrayOfIdAndName(allProducts, "supplier_id", "supplier");

  res.render("products", {
    categories,
    suppliers,
    products,
    query: req.query,
    currentPage: currentPage,
    totalPages: totalPages,
  });
};

module.exports = { getDashboard, getProducts, getSearchProducts };
