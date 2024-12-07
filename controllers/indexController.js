const {
  getAllCategories,
  getAllSuppliers,
  getAllProductsWithCategoryAndSupplier,
  getSearchItems,
} = require("../db/db_utilities");
const { getArrayOfIdAndName } = require("../public/js/utilities");

const { route } = require("../routes/indexRouter");

const getDashboard = (req, res) => {
  res.render("index");
};

const getProducts = async (req, res, next) => {
  // if there are query parameters, redirect to the search route
  if (Object.keys(req.query).length > 0) {
    return next(route);
  }

  let products = await getAllProductsWithCategoryAndSupplier();

  // get array of categories.name and categories_id
  let categories = getArrayOfIdAndName(products, "category_id", "category");

  // get array of suppliers.name and suppliers_id
  let suppliers = getArrayOfIdAndName(products, "supplier_id", "supplier");

  res.render("products", {
    categories,
    suppliers,
    products,
    query: req.query,
  });
};

const getSearchProducts = async (req, res) => {
  const products = await getSearchItems(req.query);

  let allProducts = await getAllProductsWithCategoryAndSupplier();

  // get array of distinct categories.name and categories_id from all products
  let categories = getArrayOfIdAndName(allProducts, "category_id", "category");

  // get array of distinct suppliers.name and suppliers_id
  let suppliers = getArrayOfIdAndName(allProducts, "supplier_id", "supplier");

  console.log(req.query);

  res.render("products", {
    categories,
    suppliers,
    products,
    query: req.query,
  });
};

module.exports = { getDashboard, getProducts, getSearchProducts };
