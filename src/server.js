"use strict";

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const productRoutes = require("./productRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

/** Permite cereri cross-origin */
app.use(cors());

/** Parseaza corpul cererilor JSON */
app.use(express.json());

/** Serveste fisierele statice din /public */
app.use(express.static(path.join(__dirname, "..", "public")));

/** Rutele API pentru produse */
app.use("/api/products", productRoutes);

/** Pagina principala */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/** Handler erori globale */
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err.stack);
  res.status(500).json({ success: false, message: "Eroare interna de server." });
});

/** Pornire server */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serverul ruleaza la http://localhost:${PORT}`);
  });
}

module.exports = app;