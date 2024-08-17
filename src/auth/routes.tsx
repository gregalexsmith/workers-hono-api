import { Context } from "../types";
import { z } from "zod";
import { initializeLucia } from "./lib";
import { UserModule } from "../user";
import { Scrypt } from "lucia";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { json401Response, requestBody } from "../openapi";
import { getDB } from "../db";

const app = new OpenAPIHono<Context>();

app.openapi(
  createRoute({
    method: "post",
    path: "/signup",
    ...requestBody(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    ),
    responses: {
      302: {
        description: "Redirect to home page",
        headers: {
          Location: {
            schema: {
              type: "string",
              example: "/",
            },
          },
        },
      },
      ...json401Response,
    },
  }),
  async (c) => {
    const userModule = UserModule(getDB(c));
    const lucia = initializeLucia(c.env.DB);
    const { email, password } = c.req.valid("json");

    // check if email already exists
    const existing = await userModule.getUserByEmail(email);
    if (existing) {
      return c.text(`Invalid Email or Password`, 400);
    }

    const newUser = await userModule.createUser(email, password);

    // Create Session
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    console.log(email, password);
    return c.redirect("/");
  },
);

app.openapi(
  createRoute({
    method: "post",
    path: "/login",
    ...requestBody(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    ),
    responses: {
      302: {
        description: "Redirect to home page",
        headers: {
          Location: {
            schema: {
              type: "string",
              example: "/",
            },
          },
        },
      },
      ...json401Response,
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const userModule = UserModule(getDB(c));
    const lucia = initializeLucia(c.env.DB);

    const user = await userModule.getUserByEmail(email);

    if (!user) {
      return c.text(`Invalid Email or Password`, 400);
    }

    const scrypt = new Scrypt();
    const isValid = await scrypt.verify(user.password, password);

    if (!isValid) {
      return c.text(`Invalid Email or Password`, 400);
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.redirect("/");
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/logout",
    responses: {
      302: {
        description: "Redirect to home page",
        headers: {
          Location: {
            schema: {
              type: "string",
              example: "/",
            },
          },
        },
      },
      ...json401Response,
    },
  }),
  async (c) => {
    const lucia = initializeLucia(c.env.DB);
    const session = c.get("session");

    if (session) {
      const blankSession = lucia.createBlankSessionCookie();
      c.header("Set-Cookie", blankSession.serialize(), {
        append: true,
      });
    }

    return c.redirect("/");
  },
);

export default app;
