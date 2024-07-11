const express = require("express");
const router = express.Router();
const { products } = require("./products.router.js");

let carts = [];

router.get("/:cid", (req, res) => {
  let idCart = parseInt(req.params.cid);

  let cart = carts.find((c) => c.id === idCart);

  if (!cart) {
    return res.send({ error: "No se encuentra el carrito" });
  } else {
    res.send({ cart });
  }
});

router.post("/", (req, res) => {
  const newCart = {
    id: Math.floor(Math.random() * 20000),
    products: [],
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

router.post("/:cid/product/:pid", (req, res) => {
  let idProduct = parseInt(req.params.pid);
  let product = products.find((p) => p.id === idProduct);

  let idCart = parseInt(req.params.cid);
  let cart = carts.find((c) => c.id === idCart);

  const newProductCart = {
    product: [product.id],
    quantity: 1,
  };

  if (!cart) {
    return res.send({ error: "No se encuentra el carrito" });
  } else {
    cart.product.push(newProductCart);
  }
});

module.exports = router;
