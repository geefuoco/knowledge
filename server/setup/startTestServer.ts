import config from "../src/config/config";
import app from "../src/app";
import request from "supertest";

function getAgent(): request.SuperAgentTest {
  return request.agent(app);
}

export default {
  getAgent,
  server: app.listen(config.TEST_PORT, () =>
    console.log(`Testing on PORT: ${config.TEST_PORT}`)
  )
};
