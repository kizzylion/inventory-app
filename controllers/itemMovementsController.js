const { getAllItemMovements } = require("../db/db_utilities");

const getAllItemActivity = async (req, res) => {
  const itemMovements = await getAllItemMovements();
  res.render("itemMovements/itemMovements", { itemMovements });
};

module.exports = { getAllItemActivity };
