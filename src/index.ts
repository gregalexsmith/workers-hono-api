import { swaggerUI } from "@hono/swagger-ui";
import { csrf, validateRequest } from "./middleware";
import { Context } from "./types";
import authRoutes from "./auth/routes";
import taskRoutes from "./task/routes";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<Context>();

app.use("*", csrf());
app.use("*", validateRequest());

app.get("/", (c) => c.redirect("/ui"));

app.route("/auth", authRoutes);
app.route("/tasks", taskRoutes);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Example API",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
