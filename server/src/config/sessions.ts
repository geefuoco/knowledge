import type { PrismaClient } from "@prisma/client";

import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import config from "./config";

const TIME_PERIOD = 1000 * 60 * 60 * 24 * 7;
const CHECK_PERIOD = 2 * 60 * 1000;

export function createSessionMiddleware(client: PrismaClient) {
  const sessionStore = new PrismaSessionStore(client, {
    checkPeriod: CHECK_PERIOD,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined
  });

  return expressSession({
    cookie: {
      maxAge: TIME_PERIOD
    },
    secret: config.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  });
}
