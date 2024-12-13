const pool = require("./pool");

// get all categories
const getAllCategories = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  return result.rows;
};

// get all products
const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM items");
  return result.rows;
};

// get total pages
const getTotalPages = async (query) => {
  const result = await pool.query("SELECT COUNT(*) FROM items");
  return Math.ceil(result.rows[0].count / 10);
};

// get all suppliers
const getAllSuppliers = async () => {
  const result = await pool.query("SELECT * FROM suppliers ORDER BY name ASC");
  return result.rows;
};

//get all products with category and supplier
const getAllProductsWithCategoryAndSupplier = async (page = 1, limit = 10) => {
  const result = await pool.query(
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id ORDER BY items.id ASC LIMIT $1 OFFSET $2",
    [limit, (page - 1) * limit]
  );

  return result.rows;
};

const getCountTotalSearchItems = async (query) => {
  let result = await pool.query(
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id"
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

  return Math.ceil(result.rows.length / 10);
};

// search products
const getSearchItems = async (query, page = 1, limit = 10) => {
  // items.name should be lowercase
  // convert search to lowercase and add % to the beginning and end of the search string

  let result = await pool.query(
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id ORDER BY items.id ASC LIMIT $1 OFFSET $2",
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

// create product
const createProduct = async (
  productName,
  productPrice,
  quantity,
  category,
  supplier,
  description,
  image
) => {
  const query =
    "INSERT INTO items (name, price, quantity, category_id, supplier_id, description, image) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  const value = [
    productName,
    productPrice,
    quantity,
    category,
    supplier,
    description,
    image,
  ];

  const result = await pool.query(query, value);
  return result.rows[0];
};

// get item by id
const getItemById = async (id) => {
  let result = await pool.query(
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id WHERE items.id = $1",
    [id]
  );
  return result.rows[0];
};

// delete product
const removeProduct = async (id) => {
  const query = "DELETE FROM items WHERE id = $1";
  const value = [id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// edit product
const updateProduct = async (
  id,
  name,
  price,
  quantity,
  category,
  supplier,
  description,
  image
) => {
  const query =
    "UPDATE items SET name = $1, price = $2, quantity = $3, category_id = $4, supplier_id = $5, description = $6, image = $7 WHERE id = $8";
  const value = [
    name,
    price,
    quantity,
    category,
    supplier,
    description,
    image,
    id,
  ];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// create category
const addCategory = async (name, description, image) => {
  const query =
    "INSERT INTO categories (name, description, image) VALUES ($1, $2, $3)";
  const value = [name, description, image];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// delete category
const removeCategory = async (id) => {
  const query = "DELETE FROM categories WHERE id = $1";
  const value = [id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// create supplier
const addSupplier = async (name, email, tel, address) => {
  const query =
    "INSERT INTO suppliers (name, email, tel, address) VALUES ($1, $2, $3, $4)";
  const value = [name, email, tel, address];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// delete supplier
const removeSupplier = async (id) => {
  const query = "DELETE FROM suppliers WHERE id = $1";
  const value = [id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// get store
const getAllStores = async () => {
  const result = await pool.query("SELECT * FROM stores");
  return result.rows;
};

// add store
const addStore = async (name, location, phone, email) => {
  const query =
    "INSERT INTO stores (name, location, phone, email) VALUES ($1, $2, $3, $4)";
  const value = [name, location, phone, email];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// delete store
const removeStore = async (id) => {
  const query = "DELETE FROM stores WHERE id = $1";
  const value = [id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

module.exports = {
  getAllCategories,
  getAllProducts,
  getAllSuppliers,
  getAllProductsWithCategoryAndSupplier,
  getSearchItems,
  getTotalPages,
  getCountTotalSearchItems,
  createProduct,
  getItemById,
  addCategory,
  removeCategory,
  removeProduct,
  addSupplier,
  removeSupplier,
  getAllStores,
  addStore,
  removeStore,
  updateProduct,
};
