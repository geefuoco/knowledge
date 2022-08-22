export default {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || "0.0.0.0",
  CLIENT: process.env.CLIENT || "http://192.168.2.210:3000",
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET
};
