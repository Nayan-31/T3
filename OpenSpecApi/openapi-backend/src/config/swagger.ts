import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";

const modulesPath = fileURLToPath(  // modulesPath Aapke src/modules folder ka path nikalta hai
  new URL("../modules/", import.meta.url),
).replace(/\\/g, "/");

const swaggerSpec = swaggerJsdoc({ //swaggerSpec Comments se bani specification store karta hai
  failOnErrors: true, //failOnErrors Comments parse karne mein error ho toh usko report karta hai

  definition: { //definition Documentation ka title, version aur server address set karta hai
    openapi: "3.0.3",

    info: {
      title: "My Users API",
      version: "1.0.0",
      description: "Users API ki documentation",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    tags: [
      {
        name: "Users",
        description: "User related APIs",
      },
    ],
  },

  apis: [`${modulesPath}**/*.ts`], //apis Us folder ki .ts files mein OpenAPI comments dhundhta hai
});

export default swaggerSpec;

//Ab project ka flow 

// users.routes.ts ke comments
//             ↓
//        swaggerJsdoc
//             ↓
//        swaggerSpec