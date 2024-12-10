const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");
const { validateNewCategory } = require("../controllers/categoriesController");
const multer = require("multer");

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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

module.exports = categoriesRouter;
