import http from "http";
import request from "supertest";

import app from "../src/app";

describe("The Server", () => {
  let server: http.Server | null = null;
  beforeAll(() => {
    server = app.listen(6000, () => console.log("Testing http server"));
  });

  afterAll(() => {
    server?.close();
  });

  it("should return not found for routes not found", async () => {
    const res = await request(app).get("/not-implemented-route");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      message: "Resource not found"
    });
  });

  it("should require auth for the /api/v1/ path", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      name: "Error",
      statusCode: 401,
      message: "No credentials were provided to access this resource."
    });
  });
});
