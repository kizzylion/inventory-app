const { getAllCategories, addCategory } = require("../db/db_utilities");
const { validationResult, body } = require("express-validator");

const validateNewCategory = [
  body("categoryName").notEmpty().withMessage("Category name is required"),
  body("categoryDescription").optional(),
  body("image").optional(),
];

const getCategories = async (req, res) => {
  const categories = await getAllCategories();
  const search = req.query.search || "";
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("categories", { categories: filteredCategories, search });
};

const getNewCategoryForm = (req, res, next) => {
  res.render("newCategory");
};

const addNewCategory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { categoryName, categoryDescription } = req.body;
  let base64Image = null;
  if (req.file) {
    base64Image = req.file.buffer.toString("base64");
  }
  await addCategory(categoryName, categoryDescription, base64Image);
  res.redirect("/categories");
};

module.exports = {
  getCategories,
  getNewCategoryForm,
  addNewCategory,
  validateNewCategory,
};
