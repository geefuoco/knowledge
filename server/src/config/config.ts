import * as fs from "fs";
import { join } from "path";

export type ProfanityFilter = (text: string) => boolean;

const fileName = "banned_words.txt";

export function createProfanityFilter(): ProfanityFilter {
  const filepath = join(__dirname, `./${fileName}`);
  const badWords = fs.readFileSync(filepath, { encoding: "utf-8" }).split("\n");
  return function (text: string): boolean {
    let result = false;
    text = text.toLowerCase();
    for (let word of badWords) {
      if (word === "") {
        continue;
      }
      word = word.toLowerCase();
      if (text === word || text.includes(word)) {
        result = true;
        console.log("text: ", text);
        console.log("bad word: ", word);
        break;
      }
    }
    return result;
  };
}

export default {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || "0.0.0.0",
  CLIENT: process.env.CLIENT || "http://192.168.2.210:3000",
  TEST_PORT: process.env.TEST_PORT || 6000,
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET || "testing-session-secret"
};
