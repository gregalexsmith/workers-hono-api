import { eq } from "drizzle-orm";
import { task } from "../db/schema";
import { DrizzleDB } from "../middleware";

export const TaskModule = (db: DrizzleDB) => {
  return {
    createTask: async (content: string, userId: string) => {
      return await db
        .insert(task)
        .values({
          id: crypto.randomUUID(),
          content,
          user_id: userId,
        })
        .returning()
        .get();
    },
    getTasksByUserId: async (userId: string) => {
      return db.select().from(task).where(eq(task.user_id, userId));
    },
    updateTask: async (id: string, content: string, completed: boolean) => {
      return await db
        .update(task)
        .set({ content, completed })
        .where(eq(task.id, id))
        .returning()
        .get();
    },
    deleteTask: async (id: string) => {
      return await db.delete(task).where(eq(task.id, id)).get();
    },
  };
};
