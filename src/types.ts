import type { User, Session } from "lucia";
import { DrizzleDB } from "./middleware";

export type Context = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    user: User | null;
    session: Session | null;
    db: DrizzleDB;
  };
};
