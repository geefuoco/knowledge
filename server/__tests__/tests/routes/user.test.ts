import request from "supertest";
import config from "../../../src/config/config";

const agent = request.agent(`localhost:${config.TEST_PORT}`);

describe("User Routes", () => {
  const userInfo = {
    email: "testingEmail@gmail.com",
    password: "testingPassword",
    username: "testUsername"
  };
  let newUserId: number | null = null;

  it("should allow a user to register", async () => {
    const res = await agent.post("/register").send(userInfo);
    expect(res.status).toBe(201);
    newUserId = res.body.id;
  });

  it("should allow a user to login", async () => {
    const res = await agent.post("/login").send(userInfo);
    expect(res.status).toBe(200);
  });
  it("should be able to access auth routes", async () => {
    const res = await agent.get("/api/v1/users");
    expect(res.status).toBe(200);
  });

  it("should be able to delete a user", async () => {
    const res = await agent.delete(`/api/v1/user/${newUserId}`);
    expect(res.status).toBe(200);
  });
});
