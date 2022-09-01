import config from "../../src/config/config";
import request from "supertest";

describe("The Server", () => {
  it("should return not found for routes not found", async () => {
    const res = await request(`localhost:${config.TEST_PORT}`).get(
      "/not-implemented-route"
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      message: "Resource not found"
    });
  });

  it("should require auth for the /api/v1/ path", async () => {
    const res = await request(`localhost:${config.TEST_PORT}`).get(
      "/api/v1/users"
    );
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      name: "Error",
      statusCode: 401,
      message: "No credentials were provided to access this resource."
    });
  });
});
