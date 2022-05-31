import request from "supertest";
import "dotenv/config";
import App from "../../App";
import { Application } from "express";

const application = new App();
let app: Application;
beforeAll(() => {
  app = application.app;
});
// POST DE LOGIN /api/login
describe("POST /api/login", () => {
  // Debe retornar un codigo de estado 200 (OK)
  test("should return status code 200", async () => {
    const response = await request(app).post("/api/login").send({
      username: "admin",
      password: "123456",
    });
    expect(response.status).toBe(200);
  });

  // Debe retornar un codigo de estado 422 ya que no se enviaron los datos correctos
  test("should return 422 status code", async () => {
    const response = await request(app).post("/api/login").send({
      password: "123456",
    });
    expect(response.status).toBe(422);
  });

  // Debe retornar un codigo de estado 401 ya que el usuario no existe o no esta autorizado
  test("should return a 401 status code", async () => {
    const response = await request(app).post("/api/login").send({
      username: "test",
      password: "123456",
    });
    expect(response.status).toBe(401);
  });

  // Debe retornar un token de acceso ya que el login se realizo correctamente
  test("should return a token", async () => {
    const response = await request(app).post("/api/login").send({
      username: "admin",
      password: "123456",
    });
    console.log(response)
    expect(response.body.data.token).toBeDefined();
  });
});
