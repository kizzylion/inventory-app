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

const getItemInStock = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM items");
  return result.rows[0].count;
};

const getTotalQuantity = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(items.quantity), 0) + COALESCE(SUM(store_items.quantity), 0) AS total_quantity
    FROM items
    LEFT JOIN store_items ON items.id = store_items.item_id;
    `);
  return result.rows[0].total_quantity;
};
const getTotalQuantityEachItem = async () => {
  const result = await pool.query(`
    SELECT items.name AS item_name, items.image AS item_image, items.supplier_id AS supplier_id, suppliers.name AS supplier_name, items.id AS item_id, items.price AS item_price, COALESCE(SUM(items.quantity), 0) + COALESCE(SUM(store_items.quantity), 0) AS total_quantity, items.price * (COALESCE(SUM(items.quantity), 0) + COALESCE(SUM(store_items.quantity), 0)) AS total_price
    FROM items
    JOIN suppliers ON items.supplier_id = suppliers.id
    LEFT JOIN store_items ON items.id = store_items.item_id
    GROUP BY items.id, suppliers.id, items.price, items.name, suppliers.name
    ORDER BY total_quantity DESC;

    `);
  return result.rows;
};

// items per category with total quantity and total price
const getItemsPerCategory = async () => {
  const result = await pool.query(
    `
    Select items.category_id, categories.name as category_name, (COALESCE(SUM(items.quantity), 0) + COALESCE(SUM(store_items.quantity), 0)) AS total_quantity, SUM((COALESCE(items.quantity, 0) + COALESCE(store_items.quantity, 0)) * COALESCE(items.price, 0)) AS total_price
    FROM items
    Left Join store_items ON items.id = store_items.item_id
    Left Join categories ON items.category_id = categories.id
    Group By items.category_id, categories.id
    Order By total_quantity DESC
    `
  );
  return result.rows;
};

// Quantity and Price Distribution across Stores
const getQuantityDistributionAcrossStores = async () => {
  const result = await pool.query(
    `
    SELECT stores.id, stores.name, SUM(store_items.quantity) AS total_quantity, SUM(items.price * store_items.quantity) AS total_price FROM stores 
    JOIN store_items ON stores.id = store_items.store_id 
    JOIN items ON store_items.item_id = items.id
    GROUP BY stores.id 
    ORDER BY total_quantity DESC
    `
  );
  return result.rows;
};

// recent 5  items in inventory
const getRecentItemsInInventory = async () => {
  const result = await pool.query(
    `SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier
     FROM items 
     JOIN categories ON items.category_id = categories.id 
     JOIN suppliers ON items.supplier_id = suppliers.id 
     ORDER BY items.date_created DESC LIMIT 5`
  );
  return result.rows;
};

// get all products
const getAllProductsAlphabetically = async () => {
  const result = await pool.query("SELECT * FROM items ORDER BY name ASC");
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
const getAllProductsWithCategoryAndSupplierWithoutLimit = async (
  page = 1,
  limit = 10
) => {
  const result = await pool.query(
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier FROM items JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id ORDER BY items.name ASC"
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
  const checkQuery = "SELECT COUNT(*) FROM store_items WHERE item_id = $1";
  const { rows } = await pool.query(checkQuery, [id]);

  if (parseInt(rows[0].count, 10) > 0) {
    return false;
  }

  const deleteQuery = "DELETE FROM items WHERE id = $1";
  const result = await pool.query(deleteQuery, [id]);
  return result.rowCount > 0; // Return a success indicator
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

// get category by id
const getCategoryById = async (id) => {
  const query = "SELECT * FROM categories WHERE id = $1";
  const value = [id];
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

// edit category
const updateCategory = async (id, name, description, image) => {
  const query =
    "UPDATE categories SET name = $1, description = $2, image = $3 WHERE id = $4";
  const value = [name, description, image, id];
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

// get supplier by id
const getSupplierById = async (id) => {
  const query = "SELECT * FROM suppliers WHERE id = $1";
  const value = [id];
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

// UPDATE SUPPLIER
const updateSupplier = async (id, name, email, tel, address) => {
  const query =
    "UPDATE suppliers SET name = $1, email = $2, tel = $3, address = $4 WHERE id = $5";
  const value = [name, email, tel, address, id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// get store
const getAllStores = async () => {
  const result = await pool.query("SELECT * FROM stores ORDER BY name ASC");
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

// get store by id
const getStoreById = async (id) => {
  const query = "SELECT * FROM stores WHERE id = $1";
  const value = [id];
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

// update store
const updateStore = async (id, name, location, phone, email) => {
  const query =
    "UPDATE stores SET name = $1, location = $2, phone = $3, email = $4 WHERE id = $5";
  const value = [name, location, phone, email, id];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// get store items
const getStoreItems = async (storeId) => {
  const query =
    "SELECT items.*, items.image AS image_base64, categories.name as category, suppliers.name as supplier, store_items.quantity as quantity, store_items.store_id as store_id FROM store_items JOIN items ON store_items.item_id = items.id JOIN categories ON items.category_id = categories.id JOIN suppliers ON items.supplier_id = suppliers.id WHERE store_items.store_id = $1";
  const value = [storeId];
  const result = await pool.query(query, value);
  return result.rows;
};

// get store inventory
const getStoreInventory = async (productId) => {
  const query =
    "SELECT store_items.*, stores.name as store_name FROM store_items JOIN stores ON store_items.store_id = stores.id WHERE store_items.item_id = $1";
  const value = [productId];
  const result = await pool.query(query, value);
  return result.rows;
};

//increment store items
const incrementStoreItems = async (storeId, itemId, quantity) => {
  const query =
    "INSERT INTO store_items (store_id, item_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (store_id, item_id) DO UPDATE SET quantity = store_items.quantity + $3";
  const value = [storeId, itemId, quantity];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// remove item from store
const decrementStoreItems = async (storeId, itemId, quantity) => {
  const query =
    "UPDATE store_items SET quantity = store_items.quantity - $3 WHERE store_id = $1 AND item_id = $2";
  const value = [storeId, itemId, quantity];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// add item to Global Inventory
const addItemToInventory = async (itemId, quantity) => {
  const query =
    "UPDATE items SET quantity = items.quantity + $2 WHERE items.id = $1";
  const value = [itemId, quantity];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// remove item from inventory
const removeItemFromInventory = async (itemId, quantity) => {
  const query =
    "UPDATE items SET quantity = items.quantity - $2 WHERE items.id = $1";
  const value = [itemId, quantity];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// get max quantity of item in store
const getMaxQuantity = async (itemId, storeId) => {
  const query =
    "SELECT quantity FROM store_items WHERE item_id = $1 AND store_id = $2";
  const value = [itemId, storeId];
  const result = await pool.query(query, value);
  return result.rows[0].quantity;
};

// insert into item_movements
const insertIntoItemMovements = async (
  itemId,
  fromStoreId,
  toStoreId,
  quantity,
  movementType,
  description
) => {
  const query =
    "INSERT INTO item_movements (item_id, from_store_id, to_store_id, quantity, movement_type, description) VALUES ($1, $2, $3, $4, $5, $6)";
  const value = [
    itemId,
    fromStoreId,
    toStoreId,
    quantity,
    movementType,
    description,
  ];
  const result = await pool.query(query, value);
  return result.rows[0];
};

// recent 5 movements
const getRecentMovements = async () => {
  const query = `SELECT item_movements.*, items.name as item_name, items.image as item_image, from_stores.name as from_store_name, to_stores.name as to_store_name, item_movements.quantity as quantity, item_movements.movement_date as movement_date, item_movements.movement_type as movement_type, item_movements.description as description 
    FROM item_movements 
    LEFT JOIN items ON item_movements.item_id = items.id 
    LEFT JOIN stores AS from_stores ON item_movements.from_store_id = from_stores.id 
    LEFT JOIN stores AS to_stores ON item_movements.to_store_id = to_stores.id 
    ORDER BY movement_date DESC LIMIT 5`;
  const result = await pool.query(query);
  return result.rows;
};

// get item movements
const getAllItemMovements = async () => {
  const query = `SELECT item_movements.*, items.name as item_name, items.image as item_image, from_stores.name as from_store_name, to_stores.name as to_store_name, item_movements.quantity as quantity, item_movements.movement_date as movement_date, item_movements.movement_type as movement_type, item_movements.description as description 
    FROM item_movements 
    LEFT JOIN items ON item_movements.item_id = items.id 
    LEFT JOIN stores AS from_stores ON item_movements.from_store_id = from_stores.id 
    LEFT JOIN stores AS to_stores ON item_movements.to_store_id = to_stores.id 
    ORDER BY movement_date DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
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
  getCategoryById,
  getSupplierById,
  getStoreById,
  addCategory,
  removeCategory,
  removeProduct,
  addSupplier,
  removeSupplier,
  getAllStores,
  addStore,
  removeStore,
  updateProduct,
  updateCategory,
  updateSupplier,
  updateStore,
  getStoreItems,
  getStoreInventory,
  getAllItemMovements,
  insertIntoItemMovements,
  getAllProductsAlphabetically,
  getMaxQuantity,
  addItemToInventory,
  removeItemFromInventory,
  incrementStoreItems,
  decrementStoreItems,
  getAllProductsWithCategoryAndSupplierWithoutLimit,

  // Dashboard
  getItemInStock,
  getTotalQuantity,
  getTotalQuantityEachItem,
  getItemsPerCategory,
  getQuantityDistributionAcrossStores,
  getRecentItemsInInventory,
  getRecentMovements,
};
