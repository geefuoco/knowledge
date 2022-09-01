import { globals } from "./setup";
const { server, agent, getUserId } = globals;

afterAll(async () => {
  console.log("AFTER ALL TESTS");
  const id = await getUserId();
  const user = await agent.get(`/api/vi/user/${id}`);
  console.log(user.body);
  console.log("USER ID TO DELETE: ", id);
  const res = await agent.delete(`/api/v1/user/${id}`);
  if (res.statusCode !== 200) {
    console.error("DID NOT DELETE THE USER");
    console.log(res.statusCode);
    console.log(res.body);
  }
  server.close();
});
