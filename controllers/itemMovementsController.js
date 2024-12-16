const {
  getAllItemMovements,
  getAllProductsAlphabetically,
  getAllStores,
  getStoreItems,
} = require("../db/db_utilities");

const getAllItemActivity = async (req, res) => {
  const itemMovements = await getAllItemMovements();
  const search = req.query.search || "";
  console.log(search);
  const filteredItemMovements = itemMovements.filter((itemMovement) =>
    itemMovement.item_name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("itemMovements/itemMovements", {
    itemMovements: filteredItemMovements,
    search,
  });
};

const getItemsByStoreId = async (req, res) => {
  const storeItems = await getStoreItems(req.params.storeId);
  res.json(storeItems);
};

const getNewItemMovementForm = async (req, res) => {
  const products = await getAllProductsAlphabetically();
  const stores = await getAllStores();

  // for each store, get the store items
  const storeItems = await Promise.all(
    stores.map(async (store) => {
      return { ...store, items: await getStoreItems(store.id) };
    })
  );
  console.log(storeItems);
  res.render("itemMovements/getNewItemMovementForm", {
    products,
    stores,
    storeItems,
  });
};

module.exports = { getAllItemActivity, getNewItemMovementForm };
