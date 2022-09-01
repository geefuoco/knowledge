import setup from "./startTestServer";

const { server, getAgent } = setup;
let userId: number;
const agent = getAgent();

beforeAll(async () => {
  console.log("BEFORE ALL TESTS");
  const userInfo = {
    email: "globalUser@gmail.com",
    password: "testingPassword",
    username: "testUsername"
  };

  const res = await agent.post("/register").send(userInfo);
  if (res.statusCode === 201) {
    console.log(`CREATED USER WITH ID: ${res.body.id}`);
    const loginRes = await agent.post("/login").send(userInfo);
    if (loginRes.statusCode === 200) {
      userId = loginRes.body.id;
      console.log("LOGGED IN");
    }
  } else {
    console.error(`USER WITH EMAIL ${userInfo.email} ALREADY EXISTS`);
  }
});

async function getUserId(): Promise<number> {
  return userId;
}

export const globals = { server, agent, getUserId };
