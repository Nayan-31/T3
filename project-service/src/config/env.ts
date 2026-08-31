import dotenv from "dotenv";
dotenv.config();

function requiredEnv(
  name: "MONGODB_URI" | "ACCESS_TOKEN_SECRET" | "MESSAGE_BROKE_URL",
): string {
  const value = process.env[name];
  console.log("envs", process.env);
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const port: number = 3000;

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be positive integer");
}

export const env = {
  PORT: port,
  MONGODB_URI: requiredEnv("MONGODB_URI"),
  ACCESS_TOKEN_SECRET: requiredEnv("ACCESS_TOKEN_SECRET"),
  MESSAGE_BROKE_URL: requiredEnv("MESSAGE_BROKE_URL"),
};
