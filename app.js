const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const indexRouter = require("./routes/indexRouter");
const productsRouter = require("./routes/productsRouter");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/products", productsRouter);

//error handling
app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
