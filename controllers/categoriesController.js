const {
  getAllCategories,
  addCategory,
  removeCategory,
  getCategoryById,
  updateCategory,
} = require("../db/db_utilities");
const { validationResult, body, check } = require("express-validator");

const validateNewCategory = [
  body("categoryName").notEmpty().withMessage("Category name is required"),
  body("categoryDescription").optional(),
  body("image").optional(),
];

const validateDeleteCategory = [
  check("deletePassword").notEmpty().withMessage("Password is required"),
];

const getCategories = async (req, res) => {
  const categories = await getAllCategories();
  const search = req.query.search || "";
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("categories", {
    categories: filteredCategories,
    search,
    deletePassword: process.env.DELETE_PASSWORD,
  });
};

const getNewCategoryForm = (req, res, next) => {
  res.render("newCategory");
};

const addNewCategory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryName, categoryDescription } = req.body;
  let base64Image = null;
  if (req.file) {
    base64Image = req.file.buffer.toString("base64");
  }
  await addCategory(categoryName, categoryDescription, base64Image);
  res.redirect("/categories");
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { deletePassword } = req.body;

  if (!deletePassword) {
    return res.status(400).send("Password is required");
  }

  if (deletePassword === process.env.ADMIN_PASSWORD) {
    await removeCategory(id);
    res.redirect("/categories");
  } else {
    res.status(401).send("Unauthorized");
  }
};

const getEditCategoryForm = async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryById(id);
  res.render("editCategory", { category });
};

const postEditCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, categoryDescription } = req.body;

  const { editPassword } = req.body;
  if (!editPassword) {
    return res.status(400).send("Password is required");
  }
  if (editPassword === process.env.ADMIN_PASSWORD) {
    let base64Image = null;
    if (req.file) {
      base64Image = req.file.buffer.toString("base64");
    } else {
      // preserve the old image
      const category = await getCategoryById(id);
      base64Image = category.image;
    }
    await updateCategory(id, categoryName, categoryDescription, base64Image);
    res.redirect("/categories");
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  getCategories,
  getNewCategoryForm,
  addNewCategory,
  validateNewCategory,
  validateDeleteCategory,
  deleteCategory,
  getEditCategoryForm,
  postEditCategory,
};
