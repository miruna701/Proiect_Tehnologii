"use strict";  /**pt greseli */

const fs   = require("fs");       /**module din Node.js */
const path = require("path");

/** Calea catre fisierul de date JSON */
const DATA_FILE = path.join(__dirname, "products.json");

/** Citeste si parseaza fisierul JSON */
function readData() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

/** Scrie datele inapoi in fisierul JSON */
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/** Returneaza toate produsele */
function getAllProducts() {
  return readData().products;
}

/** Cauta un produs dupa nume (insensibil la majuscule) */
function findProductByName(name) {
  if (typeof name !== "string" || name.trim() === "") return null;
  const { products } = readData();           /**citeste si extrage */
  const needle = name.trim().toLowerCase();   /**fara spatii, litere mari in litere mici */
  return products.find((p) => p.name.toLowerCase() === needle) || null;
}

/** Adauga un produs nou si il salveaza in JSON */
function addProduct(name, price, quantity) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Numele produsului este obligatoriu.");
  }
  if (typeof price !== "number" || isNaN(price) || price < 0) {
    throw new Error("Pretul trebuie sa fie un numar pozitiv.");
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Cantitatea trebuie sa fie un intreg nenegativ.");
  }

/** Verifica daca sunt duplicate */
  const data   = readData();
  const needle = name.trim().toLowerCase();
  const exists = data.products.some((p) => p.name.toLowerCase() === needle);

  if (exists) {
    throw new Error(`Produsul "${name.trim()}" exista deja.`);
  }

/** Creeaza produsul nou */
  const newProduct = {
    name:     name.trim(),              
    price:    parseFloat(price.toFixed(2)),
    quantity,
  };

  data.products.push(newProduct);
  writeData(data);           /**actualizeaza */
  return newProduct;
}

module.exports = { getAllProducts, findProductByName, addProduct };