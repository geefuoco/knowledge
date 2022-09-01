import { globals } from "../../../setup/setup";

describe("Post Route", () => {
  console.log("RUNNING POSTS TEST");
  let postId: number | null = null;
  it("can create a post", async () => {
    const postInfo = {
      body: "A test post",
      user_id: await globals.getUserId()
    };

    const res = await globals.agent.post("/api/v1/posts").send(postInfo);

    expect(res.statusCode).toBe(201);
    postId = res.body.id;
  });

  it("can view the created post", async () => {
    const res = await globals.agent.get(`/api/v1/post/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body).toEqual("A test post");
  });

  it("can view all posts", async () => {
    const res = await globals.agent.get("/api/v1/posts").query({ page: "1" });
    expect(res.statusCode).toBe(200);
  });

  it("can delete the created post", async () => {
    const res = await globals.agent.delete(`/api/v1/post/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body).toEqual("A test post");
  });
});
