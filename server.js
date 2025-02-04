const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const { where } = require("sequelize");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("배너 목록을 불러오는데 실패했습니다.");
    });
});

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "price",
      "seller",
      "createdAt",
      "updatedAt",
      "imageUrl",
    ],
  })
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
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("잘못된 요청입니다.");
    return;
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
    soldout: false,
  })
    .then((result) => {
      console.log(result);
      res.send({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("상품업로드에 문제가 있습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("Product:", result);
      res.send({
        product: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("상품 조회에 문제가 있습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
  // const { image } = req.file;
  // const { name } = image;
  // models.Product.findOne({
  //   where: {
  //     name: name,
  //   },
  // })
  //   .then((result) => {
  //     console.log("Product:", result);
  //     res.send({
  //       product: result,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send("상품 조회에 문제가 있습니다.");
  //   });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.send({
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("구매 정보 업데이트에 문제가 있습니다.");
    });
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
