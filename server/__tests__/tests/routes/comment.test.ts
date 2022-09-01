import { globals } from "../../../setup/setup";
const { agent, getUserId } = globals;

describe("COMMENT", () => {
  let postId = -1;
  let commentId = -1;
  beforeAll(async () => {
    const postInfo = {
      body: "A test post",
      user_id: await getUserId()
    };

    const res = await agent.post("/api/v1/posts").send(postInfo);
    postId = res.body.id;
  });

  afterAll(async () => {
    await agent.delete(`/api/v1/post/${postId}`);
  });

  it("can comment on a post", async () => {
    const commentInfo = {
      post_id: postId,
      user_id: await getUserId(),
      body: "Testing comment"
    };

    const res = await agent.post("/api/v1/comments").send(commentInfo);
    expect(res.statusCode).toBe(201);
    expect(res.body.body).toBe("Testing comment");
    commentId = res.body.id;
  });

  it("can comment on a comment", async () => {
    const commentInfo = {
      post_id: postId,
      user_id: await getUserId(),
      parent_id: commentId,
      body: "Testing nested comment"
    };

    const res = await agent.post("/api/v1/comments").send(commentInfo);
    expect(res.statusCode).toBe(201);
    expect(res.body.body).toBe("Testing nested comment");
  });

  it("can view the created comment", async () => {
    const res = await agent.get(`/api/v1/comment/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body).toBe("Testing comment");
  });

  it("can delete the comment", async () => {
    console.log(commentId);
    const res = await agent.delete(`/api/v1/comment/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body).toBe("Testing comment");
  });
});
