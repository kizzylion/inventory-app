const { getAllSuppliers } = require("../db/db_utilities");

const getSuppliers = async (req, res) => {
  const suppliers = await getAllSuppliers();
  const search = req.query.search || "";
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("suppliers", {
    suppliers: filteredSuppliers,
    search,
    deletePassword: process.env.DELETE_PASSWORD,
  });
};

module.exports = {
  getSuppliers,
};
