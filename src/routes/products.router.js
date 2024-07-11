const express = require("express");
const router = express.Router();

let products = [];

router.get("/", (req, res) => {
  let limit = parseInt(req.query.limit);

  let limitedProducts = [...products];
  if (!isNaN(limit) && limit > 0) {
    limitedProducts = limitedProducts.slice(0, limit);
  }
  res.json(limitedProducts);
});

router.get("/:pid", (req, res) => {
  let idProduct = parseInt(req.params.pid);

  let product = products.find((p) => p.id === idProduct);

  if (!product) {
    return res.send({ error: "No se encuentra el producto" });
  } else {
    res.send({ product });
  }
});

router.post("/", (req, res) => {
  const newProduct = {
    id: Math.floor(Math.random() * 20000),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  let idProduct = parseInt(req.params.pid);

  let nProduct = products.findIndex((p) => p.id === idProduct);

  if (nProduct === -1) {
    return res.status(404).json({ error: "No se encuentra el producto" });
  }

  products[nProduct] = {
    ...products[nProduct],
    ...req.body,
    id: idProduct,
  };
  console.log("Producto actualizado:", products[nProduct]);
  res.json({ product: products[nProduct] });
});

router.delete("/:pid", (req, res) => {
  let idProduct = parseInt(req.params.pid);

  products = products.filter((product) => product.id !== idProduct);
  res.json({ message: `Producto ${idProduct} eliminado` });
  res.status(204).send();
});
module.exports = router;
module.exports.products = products;
