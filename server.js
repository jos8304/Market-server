const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  models.Product.findAll()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("상품 목록을 불러오는데 실패했습니다.");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller } = body;
  if (!name || !description || !price || !seller) {
    res.send("잘못된 요청입니다.");
    return;
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
  })
    .then((result) => {
      console.log(result);
      res.send({ result });
    })
    .catch((err) => {
      console.log(err);
      res.send("상품업로드에 문제가 있습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  res.send(`id: ${params.id}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  models.sequelize
    .sync()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
      console.log("Database connection failed");
      process.exit();
    });
});
