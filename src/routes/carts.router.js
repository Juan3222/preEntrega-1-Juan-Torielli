const express = require("express");
const router = express.Router();
const {
  readJSONFile,
  writeJSONFile,
  productsFs,
  cartsFs,
} = require("../utils/fsUtils.js");

router.get("/", async (req, res) => {
  try {
    const carts = await readJSONFile(cartsFs);
    res.json(carts);
  } catch (err) {
    res.status(500).send({ error: "Error al obtener los carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  const idCart = parseInt(req.params.cid);

  try {
    const carts = await readJSONFile(cartsFs);
    const cart = carts.find((c) => c.id === idCart);

    if (!cart) {
      return res.status(404).send({ error: "No se encuentra el carrito" });
    } else {
      res.json(cart);
    }
  } catch (err) {
    res.status(500).send({ error: "Error al obtener el carrito" });
  }
});

router.post("/", async (req, res) => {
  try {
    const carts = await readJSONFile(cartsFs);
    const newCart = {
      id: Math.floor(Math.random() * 20000),
      products: [],
    };
    while (carts.some((cart) => cart.id === newCart.id)) {
      newProduct.id = Math.floor(Math.random() * 20000);
    }
    carts.push(newCart);
    await writeJSONFile(cartsFs, carts);
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).send({ error: "Error al crear el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const idProduct = parseInt(req.params.pid);
  const idCart = parseInt(req.params.cid);

  try {
    const products = await readJSONFile(productsFs);
    const carts = await readJSONFile(cartsFs);

    const product = products.find((p) => p.id === idProduct);
    if (!product) {
      return res.status(404).send({ error: "No se encuentra el producto" });
    }

    const cart = carts.find((c) => c.id === idCart);
    if (!cart) {
      return res.status(404).send({ error: "No se encuentra el carrito" });
    }

    const cartProduct = cart.products.find((p) => p.id === idProduct);
    if (cartProduct) {
      cartProduct.quantity += 1;
    } else {
      cart.products.push({ id: idProduct, quantity: 1 });
    }

    await writeJSONFile(cartsFs, carts);
    res.status(201).send({ cart });
  } catch (err) {
    res.status(500).send({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
