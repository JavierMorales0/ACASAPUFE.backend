import request from "supertest";
import "dotenv/config";
import App from "../../App";
import { Application } from "express";

const application = new App();
let app: Application;
beforeAll(() => {
  app = application.app;
});

describe("GET /api/products", () => {
  test("should return status code 200", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });
});

describe("GET /api/products/all", () => {
  test("should return status code 200", async () => {
    const response = await request(app).get("/api/products/all");
    expect(response.status).toBe(200);
  });
});

describe("POST /api/products", () => {
  test("should return a status code 201 ", async () => {
    const response = await request(app).post("/api/products").send({
      barcode: "123456789",
      description: "Producto de prueba",
      stock: 10,
    });
    expect(response.status).toBe(201);
  });
});
