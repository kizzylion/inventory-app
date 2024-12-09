const pool = require("./pool");

// get all categories
const getAllCategories = async () => {
  const result = await pool.query("SELECT * FROM categories");
  return result.rows;
};

// get all products
const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM items");
  return result.rows;
};

// get total pages
const getTotalPages = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM items");
  return Math.ceil(result.rows[0].count / 10);
};

// get all suppliers
const getAllSuppliers = async () => {
  const result = await pool.query("SELECT * FROM suppliers");
  return result.rows;
};

//get all products with category and supplier
const getAllProductsWithCategoryAndSupplier = async (page = 1, limit = 10) => {
  const result = await pool.query(
    //GET ALL ITEMS THE CATEGORY NAMES AND SUPPLIER NAMES AS WELL
    "SELECT items.*, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id ORDER BY items.id ASC LIMIT $1 OFFSET $2",
    [limit, (page - 1) * limit]
  );

  return result.rows;
};

// search products
const getSearchItems = async (query, page = 1, limit = 10) => {
  // items.name should be lowercase
  // convert search to lowercase and add % to the beginning and end of the search string

  let result = await pool.query(
    "SELECT items.*, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id LIMIT $1 OFFSET $2",
    [limit, (page - 1) * limit]
  );
  result.rows = result.rows.filter((item) => {
    if (query.search) {
      return item.name.toLowerCase().includes(query.search.toLowerCase());
    }
    if (query.category) {
      return item.category_id == query.category;
    }
    if (query.supplier) {
      return item.supplier_id == query.supplier;
    }
    return item;
  });

  return result.rows;
};

module.exports = {
  getAllCategories,
  getAllProducts,
  getAllSuppliers,
  getAllProductsWithCategoryAndSupplier,
  getSearchItems,
  getTotalPages,
};
