const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");
const {
  validateNewCategory,
  validateDeleteCategory,
} = require("../controllers/categoriesController");
const multer = require("multer");

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      req.file = file;
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

categoriesRouter.get("/", categoriesController.getCategories);

// add new category form
categoriesRouter.get("/new", categoriesController.getNewCategoryForm);

// add new category
categoriesRouter.post(
  "/new",
  upload.single("image"),
  validateNewCategory,
  categoriesController.addNewCategory
);

// delete category
categoriesRouter.post(
  "/delete/:id",
  validateDeleteCategory,
  categoriesController.deleteCategory
);

// edit category
categoriesRouter.get("/edit/:id", categoriesController.getEditCategoryForm);

// update category
categoriesRouter.post(
  "/edit/:id",
  upload.single("image"),
  validateNewCategory,
  categoriesController.postEditCategory
);

module.exports = categoriesRouter;
