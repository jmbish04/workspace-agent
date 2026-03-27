import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/backend/db/schemas/index.ts",
  out: "./drizzle",
});
