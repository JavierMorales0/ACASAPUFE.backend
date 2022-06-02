import request from "supertest";
import "dotenv/config";
import App from "../../App";
import { Application } from "express";

const application = new App();
let app: Application;
beforeAll(() => {
  app = application.app;
});

describe("GET /api/users", () => {
  test("should return status code 200", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
  });
});

describe("GET /api/users/:username", () => {
  test("should return status code 200", async () => {
    const response = await request(app).get("/api/users/admin");
    expect(response.status).toBe(200);
  });
});

describe("POST /api/users", () => {
  test("should return a status code 201", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        firstName: "Juan",
        lastName: "Perez",
        username: "jperez" + Math.floor(Math.random() * 1000000),
        password: "123456",
      });
    expect(response.status).toBe(201);
  });
});

describe("PUT /api/users/:username", () => {
  test("should return a status code 200", async () => {
    const response = await request(app).put("/api/users/admin").send({
      firstName: "Juan",
      lastName: "Perez",
      password: "123456",
    });
    expect(response.status).toBe(200);
  });
});
