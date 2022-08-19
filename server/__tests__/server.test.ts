import http from "http";
import request from "supertest";

import app from "../src/app";

describe("The Server", () => {
  const userInfo = {
    email: "testingEmail@gmail.com",
    password: "testingPassword"
  };
  let userId: number | null = null;
  let server: http.Server | null = null;
  let agent: request.SuperAgentTest | null = null;
  beforeAll(() => {
    server = app.listen(6000, () => console.log("Testing http server"));
    agent = request.agent(app);
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

  it("should allow a user to register", async () => {
    expect(agent).toBeTruthy();
    if (agent) {
      const res = await agent.post("/register").send(userInfo);
      expect(res.status).toBe(201);
      userId = res.body.id;
    }
  });

  it("should allow a user to login", async () => {
    expect(agent).toBeTruthy();
    if (agent) {
      const res = await agent.post("/login").send(userInfo);
      expect(res.status).toBe(302);
    }
  });

  it("should be able to access auth routes", async () => {
    if (agent) {
      const res = await agent.get("/api/v1/users");
      expect(res.status).toBe(200);
    }
  });

  it("should be able to delete a user", async () => {
    expect(agent).toBeTruthy();
    if (agent) {
      const res = await agent.delete(`/api/v1/user/${userId}`);
      expect(res.status).toBe(200);
    }
  });
});
