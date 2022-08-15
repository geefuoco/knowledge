import { createUserPrisma } from "./user/user";
import { createPostPrisma } from "./post/post";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
/**
At the moment, there is no need to implement a function
to create many of a single resource at a single time. 

Batch creations will be made from the underlying ORM / DB for testing purposes

*/
const User = createUserPrisma(client);
const Post = createPostPrisma(client);

const newUsers = [
  {
    email: "rocko@gmail.com",
    password: "a bad password",
    createdAt: new Date(2020, 10, 25),
    avatar: null,
    bio: null
  },
  {
    email: "marilyn@gmail.com",
    password: "a good password",
    createdAt: new Date(2022, 3, 25),
    avatar: null,
    bio: "Marilyn the photographer"
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
  {
    body: "100p on a stack",
    createdAt: new Date(Date.now()),
    user_id: 3
  },
  {
    body: "deadass b",
    createdAt: new Date(Date.now()),
    user_id: 3
  }
];

(async () => {
  //NOTE: Need to run npx prisma migrate reset to fix the ID AUTOINCREMENT
  //NOTE: This will delete everything in the data bse
  //Remove old data
  // await User.deleteAll();
  // await Post.deleteAll();
  //Create fake data
  // await client.user.createMany({ data: newUsers });
  // await client.post.createMany({ data: newPosts });
  //Make queries
  const users = await User.findAll();
  console.log(users);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  const user = await User.findById(1, false);
  console.log(user);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  const posts = await Post.findByUserId(user?.id ?? 1);
  console.log(posts);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  const newPost = await Post.create({
    body: "yo a new post",
    createdAt: new Date(Date.now()),
    user_id: 1
  });
  console.log(newPost);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  const numberOfPostsDeleted = await Post.deleteAllByUserId(1);
  console.log(numberOfPostsDeleted);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  const oldPosts = await Post.findBetweenDate(
    new Date(2010, 1, 1),
    new Date(2011, 1, 1)
  );
  console.log(oldPosts);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  client.$disconnect();
})();
