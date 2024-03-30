import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter, {
    getUserAttributes: (attributes: DatabaseUserAttributes) => {
      return {
        name: attributes.name,
        email: attributes.email,
      };
    },
  });
}

declare module "lucia" {
  interface Register {
    Auth: ReturnType<typeof initializeLucia>;
    UserId: string;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: string;
  email: string;
}
