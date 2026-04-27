"use strict";

const request = require("supertest");
const fs      = require("fs");
const path    = require("path");
const app     = require("../src/server");

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

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
});

afterAll(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
});

describe("GET /api/products", () => {
  test("raspunde cu 200 si un array de produse", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/products/search", () => {
  test("gaseste un produs existent", async () => {
    const res = await request(app).get("/api/products/search?name=Widget");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Widget");
  });

  test("cautare case-insensitive", async () => {
    const res = await request(app).get("/api/products/search?name=widget");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Widget");
  });

  test("returneaza 404 pentru produs inexistent", async () => {
    const res = await request(app).get("/api/products/search?name=iPad");
    expect(res.statusCode).toBe(404);
  });

  test("returneaza 400 fara parametrul name", async () => {
    const res = await request(app).get("/api/products/search");
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/products", () => {
  test("adauga un produs nou cu succes", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Sprocket", price: 12.5, quantity: 8 });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe("Sprocket");
  });

  test("returneaza 409 daca produsul exista deja", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Widget", price: 1, quantity: 1 });
    expect(res.statusCode).toBe(409);
  });

  test("returneaza 400 fara campurile necesare", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Doar nume" });
    expect(res.statusCode).toBe(400);
  });
});