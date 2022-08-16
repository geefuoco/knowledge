import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const newUsers = [
  {
    email: "rocko@gmail.com",
    password: "a bad password",
    createdAt: new Date(2020, 10, 25),
    avatar: null,
    bio: null
  },
  {
    email: "julian@gmail.com",
    password: "not a password",
    createdAt: new Date(2021, 12, 25),
    avatar: null,
    bio: "I do stuff sometimes"
  },
  {
    email: "montana@gmail.com",
    password: "you will never guess this",
    createdAt: new Date(Date.now()),
    avatar: null,
    bio: "not your average"
  }
];

const newPosts = [
  {
    body: "loving this new song",
    createdAt: new Date(Date.now()),
    user_id: 1
  },
  {
    body: "actual i dont like this new song",
    createdAt: new Date(Date.now()),
    user_id: 1
  },
  {
    body: "new game looks cool !",
    createdAt: new Date(2010, 6, 5),
    user_id: 2
  },
  {
    body: "Wondering what I should eat today",
    createdAt: new Date(Date.now()),
    user_id: 3
  },
  {
    body: "I think I'll have tacos.",
    createdAt: new Date(Date.now()),
    user_id: 3
  },
  {},
  {
    body: "deadass b",
    createdAt: new Date(Date.now()),
    user_id: 3
  }
];

(async () => {
  await client.user.deleteMany();
  await client.post.deleteMany();

  const user1 = await client.user.create({
    data: {
      email: "marilyn@gmail.com",
      password: "a good password",
      createdAt: new Date(2022, 3, 25),
      avatar: null,
      bio: "Marilyn the photographer"
    }
  });

  const user2 = await client.user.create({
    data: {
      email: "rocko@gmail.com",
      password: "a bad password",
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

  const like = await client.like.create({
    data: {
      user_id: user2.id,
      comment_id: comment3.id
    }
  });

  client.$disconnect();
})();
