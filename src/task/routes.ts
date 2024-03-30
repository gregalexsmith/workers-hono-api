import { z, createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { json200Response, json401Response, requestBody } from "../openapi";
import { TaskModule } from "./modules";
import { Context } from "../types";
import { getDB } from "../db/helpers";

const TaskSchema = z
  .object({
    id: z.string().openapi({ example: "123" }),
    content: z.string().openapi({ example: "Write some code" }),
    user_id: z.string().openapi({ example: "234" }),
  })
  .openapi("Task");

const app = new OpenAPIHono<Context>();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      ...json200Response(z.array(TaskSchema), "List of user's tasks"),
      ...json401Response,
    },
  }),
  async (c) => {
    const taskModule = TaskModule(getDB(c));
    const user = c.get("user");
    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const tasks = await taskModule.getTasksByUserId(user.id);
    return c.json(tasks);
  },
);

app.openapi(
  createRoute({
    method: "post",
    path: "/",
    ...requestBody(z.object({ content: z.string() })),
    responses: {
      ...json200Response(TaskSchema, "Task created successfully"),
      ...json401Response,
    },
  }),
  async (c) => {
    const taskModule = TaskModule(getDB(c));
    const user = c.get("user");
    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const { content } = c.req.valid("json");
    const task = await taskModule.createTask(content, user.id);
    return c.json(task);
  },
);

export default app;
