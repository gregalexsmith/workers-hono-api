import { eq } from "drizzle-orm";
import { user } from "../db/schema";
import { DrizzleDB } from "../middleware";
import { Scrypt } from "lucia";

export const UserModule = (db: DrizzleDB) => {
  return {
    createUser: async (email: string, password: string) => {
      const scrypt = new Scrypt();
      const hashedPassword = await scrypt.hash(password);
      return await db
        .insert(user)
        .values({
          id: crypto.randomUUID(),
          email,
          password: hashedPassword,
        })
        .returning()
        .get();
    },
    getUserById: async (id: string) => {
      const users = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
      return users[0];
    },
    getUserByEmail: async (email: string) => {
      const users = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);
      return users[0];
    },
  };
};
