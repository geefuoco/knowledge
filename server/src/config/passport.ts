import type { User, UserRepository } from "../data_access/user/user_repository";
import type { PassportStatic } from "passport";
import passportLocal from "passport-local";
import passport from "passport";

import apiErrors from "../errors/api_errors";

function createVerifyCallback(User: UserRepository) {
  return async function (username: string, password: string, done: Function) {
    try {
      const user = await User.login(username, password);
      if (!user) {
        return done(apiErrors.createNotFoundError());
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };
}

export function createPassportStrategy(User: UserRepository): PassportStatic {
  const LocalStrategy = passportLocal.Strategy;
  passport.serializeUser(async (user: User, done: Function) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done: Function) => {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return done(apiErrors.createNotFoundError());
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  const config = {
    usernameField: "email",
    passwordField: "password"
  };
  passport.use(new LocalStrategy(config, createVerifyCallback(User)));
  return passport;
}
