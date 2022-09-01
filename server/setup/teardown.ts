import { globals } from "./setup";
const { server, agent, getUserId } = globals;

afterAll(async () => {
  console.log("AFTER ALL TESTS");
  const id = await getUserId();
  const res = await agent.delete(`/api/v1/user/${id}`);
  if (res.statusCode !== 200) {
    console.error("DID NOT DELETE THE USER");
  }
  server.close();
});
