"use strict";

const express        = require("express");          /**framework, permite sa creeze rute */
const productService = require("./productService");

const router = express.Router();

/** GET /api/products - returneaza toate produsele */
router.get("/", (req, res) => {
  try {
    const products = productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** GET /api/products/search?name=... - cauta un produs */
router.get("/search", (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Parametrul 'name' este obligatoriu.",
    });
  }

  try {
    const product = productService.findProductByName(name);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Ne pare rau, produsul "${name}" nu a fost gasit in magazinul nostru.`,
      });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** POST /api/products - adauga un produs nou */
router.post("/", (req, res) => {
  const { name, price, quantity } = req.body;

  if (name === undefined || price === undefined || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Campurile 'name', 'price' si 'quantity' sunt obligatorii.",
    });
  }

  const parsedPrice    = parseFloat(price);
  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
    return res.status(400).json({
      success: false,
      message: "Pretul si cantitatea trebuie sa fie valori numerice valide.",
    });
  }

  try {
    const newProduct = productService.addProduct(name, parsedPrice, parsedQuantity);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    const status = err.message.includes("exista deja") ? 409 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
});

module.exports = router;