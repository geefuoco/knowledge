import http from "http";
import request from "supertest";

import app from "../../src/app";

describe("Post Route", () => {
  let server: http.Server | null = null;
  let agent: request.SuperAgentTest | null = null;
  let userId: number | null = null;
  let postId: number | null = null;
  beforeAll(async () => {
    server = app.listen(6000, () => console.log("Testing on port 6000"));
    agent = request.agent(app);

    const userInfo = {
      email: "testingEmail@gmail.com",
      password: "testingPassword",
      username: "testUsername"
    };

    const res = await agent.post("/register").send(userInfo);
    if (res.statusCode === 201) {
      const res = await agent.post("/login").send(userInfo);
      if (res.statusCode === 200) {
        userId = res.body.id;
        console.log("logged in");
      } else {
        console.log("Could not log in user");
        process.exit(1);
      }
    }
  });

  afterAll(async () => {
    if (agent) {
      await agent.delete(`/api/v1/user/${userId}`);
    }
    server?.close();
  });

  it("can create a post", async () => {
    if (agent) {
      const postInfo = {
        body: "A test post",
        user_id: userId
      };

      const res = await agent.post("/api/v1/posts").send(postInfo);

      expect(res.statusCode).toBe(201);
      postId = res.body.id;
    }
  });

  it("can view the created post", async () => {
    if (agent) {
      const res = await agent.get(`/api/v1/post/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.body).toEqual("A test post");
    }
  });

  it("can view all posts", async () => {
    if (agent) {
      const res = await agent.get("/api/v1/posts").query({ page: "1" });
      expect(res.statusCode).toBe(200);
    }
  });

  it("can delete the created post", async () => {
    if (agent) {
      const res = await agent.delete(`/api/v1/post/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.body).toEqual("A test post");
    }
  });
});
