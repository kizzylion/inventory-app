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

const getNewItemMovementForm = async (req, res) => {
  const products = await getAllProductsAlphabetically();
  const stores = await getAllStores();

  // for each store, get the store items
  const storeItems = await Promise.all(
    stores.map(async (store) => {
      return { ...store, items: await getStoreItems(store.id) };
    })
  );
  res.render("itemMovements/getNewItemMovementForm", {
    products,
    stores,
    storeItems,
  });
};

const addNewItemMovement = async (req, res) => {
  console.log(req.body);
  res.redirect("/item-movements");
};

module.exports = {
  getAllItemActivity,
  getNewItemMovementForm,
  addNewItemMovement,
};
