import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT = bcrypt.genSaltSync(10);
//This might not work if genSalt is not pseudorandom

const client = new PrismaClient();

(async () => {
  await client.user.deleteMany();
  await client.post.deleteMany();

  const user1 = await client.user.create({
    data: {
      username: "Marilyn",
      email: "marilyn@gmail.com",
      password: bcrypt.hashSync("a good password", SALT),
      createdAt: new Date(2022, 3, 25),
      avatar: null,
      bio: "Marilyn the photographer"
    }
  });

  const user2 = await client.user.create({
    data: {
      username: "rocko",
      email: "rocko@gmail.com",
      password: bcrypt.hashSync("a bad password", SALT),
      createdAt: new Date(Date.now()),
      avatar: null,
      bio: "the fighter"
    }
  });

  const post1 = await client.post.create({
    data: {
      body: "100p on a stack",
      createdAt: new Date(Date.now()),
      user_id: user1.id
    }
  });

  const post2 = await client.post.create({
    data: {
      body: "this is a bad post honestly",
      createdAt: new Date(Date.now()),
      user_id: user2.id
    }
  });

  const comment1 = await client.comment.create({
    data: {
      body: "I'm commenting on my own post",
      createdAt: new Date(Date.now() - 86400),
      post_id: post1.id,
      user_id: user1.id
    }
  });
  const comment2 = await client.comment.create({
    data: {
      body: "I'm a nested comment ! Look at me go !",
      createdAt: new Date(Date.now() - 70000),
      post_id: post1.id,
      user_id: user2.id,
      parent_id: comment1.id
    }
  });

  const comment3 = await client.comment.create({
    data: {
      body: "This post sucks !",
      createdAt: new Date(Date.now()),
      post_id: post2.id,
      user_id: user1.id
    }
  });

  const comment4 = await client.comment.create({
    data: {
      body: "triply nested comment",
      createdAt: new Date(Date.now()),
      post_id: post1.id,
      user_id: user2.id,
      parent_id: comment2.id
    }
  });

  const _comment5 = await client.comment.create({
    data: {
      body: "quadruply nested comment",
      createdAt: new Date(Date.now()),
      post_id: post1.id,
      user_id: user1.id,
      parent_id: comment4.id
    }
  });

  const key = `comment_${comment3.id}_${user2.id}`;
  const _like = await client.like.create({
    data: {
      key,
      user_id: user2.id,
      comment_id: comment3.id
    }
  });

  client.$disconnect();
})();
