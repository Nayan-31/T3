import fs from "node:fs";
import { fileURLToPath } from "node:url";
import swaggerSpec from "../src/config/swagger.js";

const outputDir = new URL("../generated/", import.meta.url); //Decide karta hai JSON kahan save hogi
const outputFile = new URL("openapi.json", outputDir); //Decide karta hai JSON kahan save hogi

fs.mkdirSync(outputDir, { recursive: true }); //generated folder nahi hai toh bana deta hai

fs.writeFileSync( //JSON ko file mein save karta hai
  outputFile,
  JSON.stringify(swaggerSpec, null, 2), //Specification ko readable JSON text mein convert karta hai
  "utf-8",
);

console.log(
  `OpenAPI file ban gayi: ${fileURLToPath(outputFile)}`,
);