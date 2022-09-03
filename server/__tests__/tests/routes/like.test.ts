import { globals } from "../../../setup/setup";
const { agent, getUserId } = globals;

describe("LIKES", () => {
  let postId = -1;
  let commentId = -1;
  beforeAll(async () => {
    const userId = await getUserId();
    const postInfo = {
      user_id: userId,
      body: "testing post"
    };

    const postRes = await agent.post(`/api/v1/posts`).send(postInfo);
    postId = postRes.body.id;

    const commentInfo = {
      user_id: userId,
      post_id: postId,
      body: "testing comment"
    };

    const commentRes = await agent.post(`/api/v1/comments`).send(commentInfo);
    commentId = commentRes.body.id;
  });

  afterAll(async () => {
    await agent.delete(`/api/v1/post/${postId}`);
  });

  it("should create a like on a post", async () => {
    const likeInfo = {
      user_id: await getUserId(),
      post_id: postId
    };

    const res = await agent.post(`/api/v1/likes`).send(likeInfo);
    console.log(res.statusCode);
    console.log(res.body);
    expect(res.statusCode).toBe(201);
  });

  it("should create a like on a post", async () => {
    const uid = await getUserId();
    const key = `comment_${commentId}_${uid}`;
    const likeInfo = {
      key,
      user_id: uid,
      comment_id: commentId
    };

    const res = await agent.post(`/api/v1/likes`).send(likeInfo);
    expect(res.statusCode).toBe(201);
  });
});
