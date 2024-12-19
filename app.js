const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require("./routes/indexRouter");
const productsRouter = require("./routes/productsRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const suppliersRouter = require("./routes/suppliersRouter");
const storesRouter = require("./routes/storesRouter");
const itemMovementsRouter = require("./routes/itemMovementsRouter");

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/stores", storesRouter);
app.use("/suppliers", suppliersRouter);
app.use("/item-movements", itemMovementsRouter);

//error handling
app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
