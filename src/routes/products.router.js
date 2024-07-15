const express = require("express");
const router = express.Router();
const {
  readJSONFile,
  writeJSONFile,
  productsFs,
} = require("../utils/fsUtils.js");

router.get("/", async (req, res) => {
  try {
    let products = await readJSONFile(productsFs);

    let limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const idProduct = parseInt(req.params.pid);

  try {
    const products = await readJSONFile(productsFs);
    const product = products.find((p) => p.id === idProduct);

    if (!product) {
      res.status(404).json({ message: "No se encuentra el producto" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    let products = await readJSONFile(productsFs);

    let newProduct = {
      id: Math.floor(Math.random() * 20000),
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: Math.floor(Math.random() * 100),
      status: req.body.status,
      stock: req.body.stock,
      category: req.body.category,
    };
    while (products.some((product) => product.id === newProduct.id)) {
      newProduct.id = Math.floor(Math.random() * 20000);
    }
    products.push(newProduct);

    await writeJSONFile(productsFs, products);

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  const idProduct = parseInt(req.params.pid);

  try {
    let products = await readJSONFile(productsFs);
    let productIndex = products.findIndex((p) => p.id === idProduct);

    if (productIndex === -1) {
      return res.status(404).json({ error: "No se encuentra el producto" });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      id: idProduct,
    };

    await writeJSONFile(productsFs, products);
    res.json({ product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});
router.delete("/:pid", async (req, res) => {
  const idProduct = parseInt(req.params.pid);

  try {
    let products = await readJSONFile(productsFs);
    products = products.filter((product) => product.id !== idProduct);
    await writeJSONFile(productsFs, products);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
