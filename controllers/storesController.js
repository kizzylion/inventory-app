const { getAllStores, addStore } = require("../db/db_utilities");

const getStore = async (req, res) => {
  const stores = await getAllStores();
  const search = req.query.search || "";
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("stores", {
    stores: filteredStores,
    search,
    deletePassword: process.env.DELETE_PASSWORD,
  });
};

const getNewStoreForm = (req, res) => {
  res.render("newStore");
};

const addStoreController = async (req, res) => {
  const { name, location, phone, email } = req.body;
  await addStore(name, location, phone, email);
  res.redirect("/stores");
};

module.exports = { getStore, addStoreController, getNewStoreForm };
