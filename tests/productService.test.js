"use strict";

const fs   = require("fs");
const path = require("path");

const DATA_FILE    = path.join(__dirname, "../src/products.json");
const INITIAL_DATA = {
  products: [
    { name: "Widget",    price: 25.00, quantity: 5  },
    { name: "Thing",     price: 15.00, quantity: 5  },
    { name: "Doodad",    price: 5.00,  quantity: 10 },
    { name: "Gadget",    price: 49.99, quantity: 3  },
    { name: "Doohickey", price: 9.99,  quantity: 20 },
  ],
};

const service = require("../src/productService");

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
});

afterAll(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
});

describe("getAllProducts()", () => {
  test("returneaza un array nenul", () => {
    const products = service.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
});

describe("findProductByName()", () => {
  test("gaseste produsul cu numele exact", () => {
    const p = service.findProductByName("Widget");
    expect(p).not.toBeNull();
    expect(p.name).toBe("Widget");
  });

  test("cautarea este insensibila la majuscule", () => {
    expect(service.findProductByName("widget")).not.toBeNull();
    expect(service.findProductByName("WIDGET")).not.toBeNull();
  });

  test("returneaza null pentru produs inexistent", () => {
    expect(service.findProductByName("iPad")).toBeNull();
  });

  test("returneaza null pentru sir vid", () => {
    expect(service.findProductByName("")).toBeNull();
  });
});

describe("addProduct()", () => {
  test("adauga un produs nou", () => {
    const p = service.addProduct("Sprocket", 12.50, 8);
    expect(p.name).toBe("Sprocket");
    expect(p.price).toBe(12.50);
    expect(p.quantity).toBe(8);
  });

  test("produsul nou este disponibil imediat", () => {
    service.addProduct("Sprocket", 12.50, 8);
    expect(service.findProductByName("Sprocket")).not.toBeNull();
  });

  test("arunca eroare daca produsul exista deja", () => {
    expect(() => service.addProduct("Widget", 1.00, 1)).toThrow();
  });

  test("arunca eroare daca pretul este negativ", () => {
    expect(() => service.addProduct("Nou", -5, 1)).toThrow();
  });

  test("arunca eroare daca numele este vid", () => {
    expect(() => service.addProduct("", 5, 1)).toThrow();
  });
});