import { z } from "zod";

export const requestBody = (schema: z.ZodType) => ({
  request: {
    body: {
      content: {
        "application/json": {
          schema,
        },
      },
    },
  },
});

export const json200Response = (schema: z.ZodType, description: string) => ({
  200: {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  },
});

export const json401Response = {
  401: {
    content: {
      "application/json": {
        schema: z.object({
          message: z.string(),
        }),
      },
    },
    description: "Unauthorized",
  },
};
