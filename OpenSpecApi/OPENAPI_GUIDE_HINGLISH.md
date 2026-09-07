# OpenAPI Backend: Zero se Documentation aur Client SDK tak

Ye guide aapke Notion notes ko ek complete, step-by-step implementation mein convert karti hai. Har step mein kya karna hai, kyun karna hai, aur uska practical fayda diya gaya hai.

Hum TypeScript + pnpm + Express ka backend banayenge, routes ke comments se OpenAPI JSON generate karenge, Swagger UI aur Scalar mein docs dikhayenge, aur frontend ke liye Axios-based TypeScript SDK generate karenge.

**Scope:** Example mein Users API complete hogi. Database ki jagah memory use hogi; server restart par naye users reset ho jayenge. Authentication aur Products ko future work ke roop mein track karenge. Ye guide project banane ke instructions deti hai; sirf Markdown file create karne se backend install/run nahi hota.

## Pehle samjho: problem solve kaise hogi?

Maan lo backend engineer ne `POST /api/users` banaya. Frontend engineer ko ye sab pata hona chahiye:

- Exact URL aur HTTP method kya hai?
- Body, query aur path mein kya bhejna hai?
- Kaunse fields required hain?
- Success aur failure mein response kaisa hoga?
- API available hai ya abhi planned hai?

OpenAPI ek machine-readable **API contract** hai: JSON/YAML document jo API ka agreed structure describe karta hai. OpenAPI khud server, database ya authentication implement nahi karta. [Official OpenAPI specification](https://spec.openapis.org/oas/v3.0.3.html)

```text
Express routes + @openapi comments
               |
               v
         swagger-jsdoc
               |
               v
     generated/openapi.json
          /           \
         v             v
 Swagger UI / Scalar   SDK generator
 (insaan ke liye)      (frontend code ke liye)
```

| Cheez | Role | Practical fayda |
| --- | --- | --- |
| Express | Actual HTTP requests handle karta hai | API sach mein chalti hai |
| TypeScript | Development time par types check karta hai | Kai coding mistakes jaldi milti hain |
| OpenAPI | Request/response contract describe karta hai | Team ke paas common reference hota hai |
| swagger-jsdoc | Annotated comments se spec banata hai | Route ke paas documentation maintain hoti hai |
| Swagger UI / Scalar | Spec ko interactive page banate hain | Browser se endpoints explore/test kar sakte ho |
| SDK generator | Spec se functions aur types banata hai | Manual request boilerplate kam hota hai |

**Boundary samajhna zaroori hai:** Comments code ke saath automatically synchronize nahi hote. Agar implementation change karke comments nahi badle, docs aur SDK galat ho sakte hain. TypeScript types bhi incoming network data ko runtime par validate nahi karte.

## Original notes mein kya update kiya gaya hai?

| Notion mein | Is guide mein | Reason |
| --- | --- | --- |
| Pehle `npx tsc --init` | Pehle project aur local TypeScript install | Project ka installed compiler use hoga |
| OpenAPI `3.1.0` | Example mein `3.0.3` | Example ko 3.1 features nahi chahiye; original legacy generator 3.0 support document karta hai |
| `"<http://localhost:3000>"` | `"http://localhost:3000"` | Angle brackets URL ka part nahi hain |
| `spec: { content: ... }` | Scalar mein top-level `url` | Current documented integration follow hoti hai |
| Sirf `tsc` build | Pehle spec generate, phir compile | Production mein source comments scan karne ki dependency nahi rahegi |
| `openapi-typescript-codegen` | Main flow mein `@hey-api/openapi-ts` | Original generator unmaintained hai; maintainer migration recommend karta hai |

Original generator ke maintainer ne package unmaintained/deprecated hone ki announcement ki hai. Isliye naye setup mein Hey API use kar rahe hain; purane notes samajhne ke liye legacy commands neeche diye hain. [Maintainer announcement](https://github.com/ferdikoomen/openapi-typescript-codegen#important-announcement)

OpenAPI `3.1` invalid nahi hai. Agar uske JSON Schema features chahiye, apne parser, validator aur generator ki compatibility verify karke adopt karo; sirf version string badalna schema migration nahi hota.

## Step 1: Tools check karo aur project initialize karo

**Kya karna hai:** Node.js ka supported LTS release install karo jo dependencies ke engine requirements satisfy kare. Is guide ke liye Node.js 22.18+ ya newer supported LTS choose karo; current Hey API docs Node 22+ environment describe karti hain. [Hey API setup](https://heyapi.dev/docs/openapi/typescript/get-started)

```bash
node --version
npm --version
```

Agar pnpm installed nahi hai:

```bash
npm install --global pnpm
pnpm --version
```

Ye npm command sirf pnpm bootstrap karne ke liye hai. Project dependencies aage pnpm se manage hongi. OS-specific installation alternatives ke liye [official pnpm installation](https://pnpm.io/installation) dekho.

Naya project banana ho:

```bash
mkdir openapi-backend
cd openapi-backend
pnpm init
```

Agar already `OpenSpecApi` folder ke andar ho, `mkdir` aur `cd` skip karo. Existing `package.json` ho to `pnpm init` bhi skip karo.

**Kyun:** `package.json` project ke scripts aur dependencies ka record hai. Ek package manager use karne se competing lockfiles nahi bante.

**Fayda:** Teammates aur CI same `pnpm-lock.yaml` se dependencies install kar sakte hain. Lockfile Git mein commit karna.

## Step 2: Dependencies install karo

Project root mein:

```bash
pnpm add express@5 swagger-ui-express @scalar/express-api-reference axios
pnpm add -D typescript tsx @types/node @types/express@5 @types/swagger-ui-express swagger-jsdoc@6 @types/swagger-jsdoc
pnpm add -D -E @hey-api/openapi-ts
pnpm exec tsc --init
```

| Package | Kyun liya? | Kab use hoga? |
| --- | --- | --- |
| `express` | Routes aur middleware | Server runtime |
| `swagger-ui-express` | Swagger UI host karne ke liye | `/swagger` kholne par |
| `@scalar/express-api-reference` | Alternate API docs interface | `/docs` kholne par |
| `axios` | Generated SDK requests bhejega | SDK consume karne wale app mein |
| `typescript` | Type checking aur JS compilation | `typecheck` / `build` |
| `tsx` | TS development server aur scripts run karna | Development / generation |
| `@types/*` | Libraries aur Node APIs ki TS declarations | Editor / type checking |
| `swagger-jsdoc` | Comments parse karke spec banana | Generation / build |
| `@hey-api/openapi-ts` | Spec se SDK banana | Client generation |

**Kyun `-D`:** Ye tools build/development ke liye hain. Hamara production server generated JSON read karega, isliye `swagger-jsdoc` ko runtime par import nahi karega. Aapke original setup mein live `swaggerSpec` import hota hai, isliye wahan `swagger-jsdoc` runtime dependency rakhna logical hai.

**Kyun `-E`:** Hey API exact version pin karne ko kehta hai, kyunki breaking updates aa sakte hain. Install ke waqt resolved version `package.json` mein exact save hoga. Team lockfile aur pnpm version bhi align kare. [Hey API installation and versioning](https://heyapi.dev/docs/openapi/typescript/get-started#installation)

**Expected result:** `package.json`, `pnpm-lock.yaml`, `node_modules/` aur `tsconfig.json` available honge.

## Step 3: Folder structure banao

```bash
mkdir -p src/config src/modules/users scripts
```

Final structure aisa hoga; `generated/`, `dist/` aur `client/src/api/` commands se banenge:

```text
openapi-backend/
├── src/
│   ├── config/swagger.ts
│   ├── modules/users/users.routes.ts
│   ├── app.ts
│   └── server.ts
├── scripts/generate-openapi.ts
├── generated/openapi.json
├── client/src/api/
├── openapi-ts.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── package.json
├── pnpm-lock.yaml
└── .gitignore
```

**Kyun:** Routes feature ke hisaab se grouped hain. Spec generation server startup se independent hai. SDK generated output alag folder mein rahega.

**Fayda:** Naya module add karna aur generated changes review karna easy hoga. `client/` abhi output folder hai, complete React app nahi.

## Step 4: TypeScript aur ESM configure karo

`package.json` mein existing dependencies preserve karte hue ye fields add/replace karo:

```json
{
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "pnpm run generate:openapi && tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "pnpm run generate:openapi && tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "generate:openapi": "tsx scripts/generate-openapi.ts",
    "generate:client": "pnpm run generate:openapi && openapi-ts"
  }
}
```

Ye **merge karne wala snippet** hai, poora `package.json` overwrite mat karna.

`tsconfig.json` ka content:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "noEmit": true
  },
  "include": ["src/**/*.ts", "scripts/**/*.ts", "openapi-ts.config.ts"],
  "exclude": ["node_modules", "dist", "client"]
}
```

`tsconfig.build.json` banao:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "client", "scripts"]
}
```

**Kyun:** `NodeNext` Node ke module behavior ke saath TypeScript align karta hai. `strict` questionable types ko flag karta hai. Build ka `rootDir: "src"` ensure karta hai ki `src/server.ts` ka output `dist/server.js` ho. [TypeScript module configuration](https://www.typescriptlang.org/tsconfig/module.html), [rootDir documentation](https://www.typescriptlang.org/tsconfig/rootDir.html)

**Do configs kyun:** Scripts bhi typecheck hone chahiye, lekin backend build output mein nahi. Isse `scripts is not under rootDir` error avoid hota hai.

**Imports mein `.js` kyun:** Neeche TS files mein `./app.js` likhenge. TypeScript source `app.ts` resolve karega aur emitted JS mein Node ke liye valid `.js` import rahega.

**Fayda:** Development aur compiled production startup ka module setup consistent rahega. `tsx` fast execution deta hai; actual type checking ke liye `pnpm run typecheck` chalana zaroori hai.

## Step 5: Actual API aur uske comments likho

`src/modules/users/users.routes.ts` banao:

```ts
import { randomUUID } from "node:crypto";
import { Router } from "express";

const router = Router();
type User = { id: string; name: string };
const users: User[] = [{ id: "1", name: "Nayan" }];

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [id, name]
 *       properties:
 *         id:
 *           type: string
 *           example: '1'
 *         name:
 *           type: string
 *           example: Nayan
 *     CreateUserInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           description: Name trim hota hai; whitespace-only value reject hoti hai.
 *           example: Asha
 *     ApiError:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: User not found
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     operationId: listUsers
 *     summary: Users ki list lao
 *     description: Available. Optional search se name filter hota hai.
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: Case-insensitive name search. Ek string value bhejo.
 *         schema:
 *           type: string
 *         example: nay
 *     responses:
 *       '200':
 *         description: Matching users; match na ho to empty array.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '400':
 *         description: Search ki value string nahi hai.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/", (req, res) => {
  const search = req.query.search;
  if (search !== undefined && typeof search !== "string") {
    res.status(400).json({ message: "search must be a single string" });
    return;
  }
  const result = search === undefined
    ? users
    : users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
  res.json(result);
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     operationId: getUserById
 *     summary: ID se ek user lao
 *     description: Available. Unknown ID par 404 return hota hai.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ka unique identifier.
 *         schema:
 *           type: string
 *         example: '1'
 *     responses:
 *       '200':
 *         description: User mil gaya.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User nahi mila.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/:id", (req, res) => {
  const user = users.find((item) => item.id === req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     operationId: createUser
 *     summary: Naya user create karo
 *     description: Available. Data memory mein rahega; restart par reset hoga.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: User create ho gaya.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid JSON ya missing/invalid name.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/", (req, res) => {
  const body: unknown = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    res.status(400).json({ message: "JSON object body is required" });
    return;
  }
  const name = (body as Record<string, unknown>).name;
  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ message: "name must be a non-empty string" });
    return;
  }
  const user: User = { id: randomUUID(), name: name.trim() };
  users.push(user);
  res.status(201).json(user);
});

export default router;
```

**Kyun code aur comments dono:** Handler actual behavior deta hai. `@openapi` comment us behavior ka contract deta hai. `swagger-jsdoc` handler ke TypeScript types se apne aap schema infer nahi karta. [swagger-jsdoc usage](https://github.com/Surnet/swagger-jsdoc)

**Comment ke important parts:**

| Field | Meaning aur reason |
| --- | --- |
| `tags` | Related operations ko group karta hai |
| `operationId` | Unique, stable operation name; generated function naming mein useful |
| `summary` / `description` | Short purpose aur behavior ki details |
| `parameters` | Path/query/header inputs describe karta hai |
| `requestBody` | JSON payload ka structure describe karta hai |
| `required` | Mandatory inputs/properties identify karta hai |
| `responses` | Success aur expected errors describe karta hai |
| `$ref` | Shared schema reuse karta hai |

Path parameter required hota hai. Express route `/:id` ka OpenAPI form `/{id}` hai. Header parameter bhi `parameters` mein `in: header` se describe kar sakte ho; bearer auth ke liye security scheme use karo. [OpenAPI parameter and operation objects](https://spec.openapis.org/oas/v3.0.3.html#parameter-object)

**Fayda:** Frontend ko list, query filter, detail lookup, body submission aur errors ke examples ek jagah milte hain. Runtime guards invalid input ko reject karte hain; comments akela ye enforce nahi karte.

## Step 6: Swagger configuration banao

`src/config/swagger.ts`:

```ts
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";

const modulesPath = fileURLToPath(new URL("../modules/", import.meta.url))
  .replace(/\\/g, "/");

const swaggerSpec = swaggerJsdoc({
  failOnErrors: true,
  definition: {
    openapi: "3.0.3",
    info: {
      title: "OpenSpec Users API",
      version: "1.0.0",
      description: "Users API contract. Sirf implemented operations yahan listed hain.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local development" },
    ],
    tags: [{ name: "Users", description: "User related APIs" }],
  },
  apis: [`${modulesPath}**/*.ts`],
});

export default swaggerSpec;
```

**Kyun:** `apis` batata hai kaunse annotated files scan karne hain. Module-relative absolute path working-directory surprises kam karta hai. `failOnErrors` parsing problems par generation fail karne mein help karta hai. Ye complete runtime contract test ka replacement nahi hai. [swagger-jsdoc configuration](https://github.com/Surnet/swagger-jsdoc#validation-of-swagger-docs)

**Version distinction:** `openapi` document format ka version hai; `info.version` aapki API contract ka version hai. Dono independent hain.

**Server URL ka fayda:** Docs ko request ka base address milta hai. Path already `/api/users` hai, isliye base URL mein dobara `/api` mat jodo.

`Authentication`/`Products` tag add karne se endpoints create nahi hote. Unki implementation aane par actual annotations aur tags add karna.

## Step 7: OpenAPI JSON generation script banao

`scripts/generate-openapi.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerSpec from "../src/config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../generated");
const outputPath = path.join(outputDir, "openapi.json");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2) + "\n", "utf-8");
console.log(`OpenAPI specification generated at: ${outputPath}`);
```

Run:

```bash
pnpm run generate:openapi
```

**Kyun ye lines:**

- `import.meta.url` current ESM file ka URL deta hai; `fileURLToPath` filesystem path banata hai.
- `path.resolve` output location script ke relative fix karta hai.
- `recursive: true` missing folders banata hai; existing folder par separate existence check zaroori nahi.
- `JSON.stringify(..., null, 2)` readable JSON banata hai, jisse Git diff review easy hota hai.

**Expected result:** `generated/openapi.json` mein `/api/users` aur `/api/users/{id}` paths honge. Ye backend start kiye bina generate hona chahiye, kyunki script server ya database import nahi karti.

**Fayda:** Isi artifact ko docs, SDK generation aur CI consume kar sakte hain. Generated JSON ko manually edit mat karo; source comments/config update karke regenerate karo.

## Step 8: Express app, Swagger UI aur Scalar connect karo

`src/app.ts`:

```ts
import fs from "node:fs";
import express from "express";
import type { ErrorRequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import { apiReference } from "@scalar/express-api-reference";
import usersRouter from "./modules/users/users.routes.js";

const swaggerSpec = JSON.parse(
  fs.readFileSync(new URL("../generated/openapi.json", import.meta.url), "utf-8"),
);

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);

app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs", apiReference({
  url: "/openapi.json",
  showDeveloperTools: "never",
}));

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError && "type" in error &&
      error.type === "entity.parse.failed") {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }
  const status = typeof error?.status === "number" &&
    error.status >= 400 && error.status < 500 ? error.status : 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : "Request rejected",
  });
};
app.use(errorHandler);

export default app;
```

`src/server.ts`:

```ts
import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`API: http://localhost:${port}/api/users`);
  console.log(`Swagger UI: http://localhost:${port}/swagger`);
  console.log(`Scalar: http://localhost:${port}/docs`);
});
```

**Kyun:** JSON parser routes se pehle chahiye, tabhi body available hogi. Router prefix aur OpenAPI path match karte hain. Error middleware last mein hai aur Express ke liye chaar arguments rakhta hai. `app.ts` aur `server.ts` alag hone se app ko future tests mein bina fixed port listener ke import kar sakte ho. [Express API reference](https://expressjs.com/en/5x/api/)

**Docs integration:** Swagger UI spec object consume karta hai. Scalar yahan `/openapi.json` se wahi contract fetch karta hai. Current Scalar integration top-level `url` ya `content` document karti hai; inline object chahiye to `apiReference({ content: swaggerSpec })` use kar sakte ho. [Swagger UI Express usage](https://github.com/scottie1984/swagger-ui-express#usage), [Scalar Express integration](https://scalar.com/products/api-references/integrations/express)

`showDeveloperTools: "never"` UI preference hai, endpoint access control nahi. [Scalar configuration](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

**Fayda:** Dono UIs same contract dikhati hain. Seekhne ke liye dono rakhe hain; actual project mein ek UI bhi sufficient hai.

## Step 9: Server run karke expected behavior verify karo

```bash
pnpm run typecheck
pnpm run dev
```

Browser mein `http://localhost:3000/swagger` aur `http://localhost:3000/docs` kholo. Doosre terminal mein:

```bash
curl -i http://localhost:3000/api/users
curl -i 'http://localhost:3000/api/users?search=nay'
curl -i http://localhost:3000/api/users/1
curl -i http://localhost:3000/api/users/missing
curl -i -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Asha"}'
curl -i -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"   "}'
curl -i -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{bad json}'
```

| Request | Expected result |
| --- | --- |
| List / search | `200`, array of users |
| ID `1` | `200`, Nayan ka object |
| Unknown ID | `404`, `{"message":"User not found"}` |
| Valid create | `201`, generated ID aur trimmed name |
| Blank name | `400`, validation message |
| Malformed JSON | `400`, JSON error object |

**Kyun:** Docs page khulna sirf rendering verify karta hai. Actual requests se handler aur documented examples compare hote hain.

**Fayda:** Frontend handoff se pehle obvious contract mismatches pakad sakte ho. Ye smoke checks hain; production ke liye integration tests aur request/response schema validation add karo. Size limits jaise middleware-level errors bhi relevant operations ke contract mein document karo.

**Refresh rule:** App JSON startup par read karta hai. Comment change ke baad `pnpm run generate:openapi` chalao, server restart karo aur browser refresh karo. `pnpm run dev` dubara start karna generation bhi karta hai. Is flow mein SDK/docs ki automatic continuous regeneration configured nahi hai.

## Step 10: TypeScript client SDK generate karo

Root mein `openapi-ts.config.ts`:

```ts
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./generated/openapi.json",
  output: "./client/src/api",
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    "@hey-api/client-axios",
  ],
});
```

Run:

```bash
pnpm run generate:client
```

**Kyun:** Pehle fresh spec generate hoti hai, phir usse SDK. Plugins types, operation functions aur Axios transport generate karte hain. Local spec file use kar rahe hain; hosted spec account ki zaroorat nahi. [Hey API setup](https://heyapi.dev/docs/openapi/typescript/get-started), [SDK plugin](https://heyapi.dev/docs/openapi/typescript/plugins/sdk)

**Expected result:** Output mein `types.gen.ts`, `sdk.gen.ts`, `client.gen.ts` aur supporting generated files milenge. Layout generator version ke saath change ho sakta hai; exact installed version pin rakho.

**Fayda:** Request URLs aur payload types manually duplicate nahi karne padte. `operationId` stable rakhne se SDK naming predictable rehti hai; operation rename frontend breaking change ban sakta hai.

## Step 11: Frontend se generated SDK use karo

Agar actual frontend separate project hai, us project mein generated `api/` directory deliver karo ya uske `src/api` path par generate karo. Sirf backend folder mein generation karne se doosre repo ka frontend update nahi hota.

Frontend project ke root mein:

```bash
pnpm add axios
```

Frontend ke `src/load-users.ts` mein, maan kar generated folder `src/api` hai:

```ts
import { client } from "./api/client.gen";
import { listUsers, getUserById, createUser } from "./api/sdk.gen";

client.setConfig({ baseURL: "http://localhost:3000" });

export async function demoUsers() {
  try {
    const { data: users } = await listUsers({
      query: { search: "nay" },
      throwOnError: true,
    });
    const { data: user } = await getUserById({
      path: { id: "1" },
      throwOnError: true,
    });
    const { data: created } = await createUser({
      body: { name: "Asha" },
      throwOnError: true,
    });
    console.log({ users, user, created });
  } catch (error) {
    console.error("Users request failed", error);
  }
}
```

Ye bundler-based frontend import style hai. Function ko apne event handler ya app flow se call karo. Is demo ko automatic page load par repeatedly call karoge to har call ek user create karegi.

Axios client mein config key `baseURL` hai. `throwOnError: true` use karne par failed requests ko `catch` mein handle kar sakte ho. Actual generated exports ko editor mein verify karo. [Hey API Axios client configuration](https://heyapi.dev/docs/openapi/typescript/clients/axios)

**Kyun:** Generated SDK ka transport actual frontend runtime mein chalta hai, isliye Axios frontend dependency bhi hona chahiye. Root install separate frontend package ki dependency declare nahi karta.

**Fayda:** Editor autocomplete, required input checking aur typed responses milte hain. Runtime par backend unexpected data bheje to types usko automatically validate nahi karenge.

**Different frontend port ho to:** Browser mein `localhost:5173` se `localhost:3000` cross-origin request hai. Dev proxy configure karo, ya backend mein specific frontend origin ke liye CORS middleware add karo. curl CORS enforce nahi karta, isliye curl success ke baad bhi browser fail ho sakta hai. [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)

**Deployment mein:** `baseURL` ko frontend framework ke environment config se set karo. `localhost` production visitor ka apna machine hota hai. Generated files mein hand edits mat karo; wrappers/config outside generated folder rakho.

## Step 12: Planned APIs ka status visible rakho

**Kya karna hai:** Root mein `API_STATUS.md` maintain karo. Starting content:

```markdown
# API Delivery Status

| Method | Path | Status | Owner | Tracking issue | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | /api/users | Available locally | Backend | TBD | Search supported |
| GET | /api/users/{id} | Available locally | Backend | TBD | 404 documented |
| POST | /api/users | Available locally | Backend | TBD | In-memory only |
| POST | /api/auth/login | Planned | Unassigned | TBD | Contract to be agreed |
| GET | /api/products | Planned | Unassigned | TBD | Pagination to be agreed |
```

**Kyun:** OpenAPI mein operation listed hone ka matlab deployed hone ki guarantee nahi. Standard built-in `planned` status nahi deta. Team chahe to custom `x-status` extension use kar sakti hai, lekin docs UI/codegen usko automatically interpret karega, ye assume mat karo. [OpenAPI specification extensions](https://spec.openapis.org/oas/v3.0.3.html#specification-extensions)

**Fayda:** Original problem ka “kaunse APIs abhi banne baaki hain?” part explicitly solve hota hai. `Available locally`, `Available on staging` aur `Available in production` alag status rakho.

Future API ka contract pehle agree karna ho to separate draft spec rakho aur clearly label karo. Mock server draft contract se ban sakta hai, lekin woh real backend availability nahi hai. Draft operations ko production SDK mein tabhi include karo jab team intentionally ye behavior chahti ho.

## Step 13: API change hone par update workflow follow karo

**Har API change ke saath:**

1. Handler aur runtime validation update karo.
2. OpenAPI comments mein inputs, schemas, examples aur responses update karo.
3. `pnpm run typecheck` chalao.
4. `pnpm run generate:client` chalao; ye spec bhi regenerate karega.
5. API smoke/integration checks aur consuming frontend ka typecheck/build chalao.
6. Generated diff review karo aur API status update karo.
7. Frontend ko updated artifact/package aur correct environment URL do.

**Kyun:** SDK generator contract follow karta hai. Galat contract se confidently typed, lekin galat client ban sakta hai.

**Fayda:** Field remove/rename karna ya optional field ko required banana jaise changes review mein visible honge. Consumer compilation kuch breaking changes pakad sakti hai; semantic changes ke liye contract tests/review zaroori hain.

## Step 14: Production build aur Git workflow

```bash
pnpm run build
pnpm start
```

Running dev server ko pehle stop karo, warna same port busy hoga.

**Kyun:** Build pehle spec banata hai, phir backend compile karta hai. Runtime app `generated/openapi.json` read karta hai, `.ts` comments scan nahi karta. Isliye deploy artifact mein `dist/`, `generated/`, `package.json`, lockfile aur installed production dependencies chahiye.

**Fayda:** Sirf compiled files deploy karne par empty docs wali common problem avoid hoti hai. Build environment mein dev dependencies install honi chahiye; build se pehle production-only install mat karo.

`.gitignore`:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
*.log
```

Is guide ki policy: `generated/openapi.json`, `client/src/api/` aur `pnpm-lock.yaml` commit karo, taaki contract aur SDK diff review ho. Alternative artifact publishing workflow bhi possible hai, lekin team mein ek consistent policy rakho.

Committed generated output ke liye CI sequence:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run generate:client
pnpm run build
git diff --exit-code -- generated/openapi.json client/src/api
git ls-files --others --exclude-standard -- generated/openapi.json client/src/api
```

`git diff --exit-code` tracked stale files par fail hota hai. Last command new untracked files dikhata hai; CI mein non-empty output ko failure treat karne ka step bhi add karo, kyunki command khud listing par fail nahi hoti. Ye checks API behavior validate nahi karte; integration tests aur spec validation alag checks hain.

Production/staging docs ke `servers` URL ko us environment ke address se configure karke artifact generate karo. Port change karne se spec ka hardcoded URL automatically change nahi hoga. Internal docs ho to appropriate access control lagao; UI option endpoint ko private nahi banata.

## Step 15: Authentication add karte waqt kya document karna hai?

Current example public hai. Jab actual authentication middleware implement ho, Swagger config ke `definition` mein ye fragment merge kar sakte ho:

```ts
components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
},
```

Protected operation ke annotation mein:

```yaml
security:
  - bearerAuth: []
```

**Kyun:** Docs aur generated client ko auth requirement pata chalti hai. `401` (missing/invalid authentication) aur relevant `403` (permission denied) responses bhi document karo. Ye illustrative fragments hain; inko add karne se token verification implement nahi hoti. [OpenAPI security schemes](https://spec.openapis.org/oas/v3.0.3.html#security-scheme-object)

**Fayda:** Frontend token bhejne ka contract samajhta hai. Login jaisi public operation par globally applied security ho to `security: []` override ki zaroorat ho sakti hai. Actual secrets/tokens docs examples mein mat rakho.

## Appendix A: Original `openapi-typescript-codegen` commands ka meaning

Ye **legacy alternative** hai; main Hey API flow ke saath dono generators same directory mein mat chalao.

Existing project isi tool par ho to original commands ye the:

```bash
pnpm add -D openapi-typescript-codegen
```

Us project's `generate:client` script:

```json
{
  "generate:client": "pnpm run generate:openapi && openapi --input generated/openapi.json --output client/src/api --client axios"
}
```

`--input` spec file, `--output` generated code folder aur `--client axios` HTTP transport select karta hai. Axios consuming app mein install hona chahiye. Legacy SDK ka API Hey API se alag hota hai; Step 11 ke imports directly reuse mat karo. Package OpenAPI 2.0/3.0 support list karta hai aur maintainer migration recommend karta hai. [Legacy generator usage and announcement](https://github.com/ferdikoomen/openapi-typescript-codegen)

**Kyun appendix:** Aapke Notion commands ka context preserve hota hai, aur naye setup ke liye maintenance decision clear rehta hai.

## Appendix B: Common errors aur unka reason

| Problem | Likely reason | Fix |
| --- | --- | --- |
| `pnpm: command not found` | pnpm install/PATH missing | Step 1 setup check karo |
| Package engine error | Node version dependency se purana | Supported compatible Node release use karo |
| `Cannot use import...` | ESM config missing/mixed | `type: module` aur NodeNext align karo |
| `dist/server.js` missing | Wrong output layout ya build nahi hua | Build config verify karke `pnpm run build` |
| `ENOENT openapi.json` | Artifact missing | `generate:openapi`; deploy mein `generated/` include karo |
| Docs empty | Glob wrong ya comments missing | Generated JSON ke `paths` aur annotation locations check karo |
| YAML parse error | Indentation/colon issue | Comment YAML mein consistent spaces aur proper quoting |
| Docs request URL galat | Servers URL aur route prefix mismatch | Base URL/path composition check karo |
| `req.body` missing | Parser/content type missing | `express.json()` aur JSON Content-Type check karo |
| curl works, browser fails | CORS | Specific frontend origin allow karo ya dev proxy |
| Docs/SDK stale | Regeneration/restart pending | Spec + client generate; server restart |
| Scalar `spec` option type error | Old config shape | Top-level `url`/`content` use karo |
| SDK import missing | Generator/version/naming different | Generated exports aur operationId inspect karo |
| `EADDRINUSE` | Port par server already running | Existing server stop ya port/config align karo |
| Created users disappear | In-memory example | Persistence ke liye database implementation add karo |

## Completion checklist

- [ ] TypeScript checking aur production build pass hote hain.
- [ ] List, detail, create aur documented failure requests expected response dete hain.
- [ ] `/openapi.json` mein implemented paths aur schemas present hain.
- [ ] Swagger UI aur Scalar request/response docs dikhate hain.
- [ ] Client generation complete hoti hai aur frontend generated functions use karta hai.
- [ ] API availability aur planned work status separately clear hai.
- [ ] Deployment mein spec artifact aur correct server URL included hai.
- [ ] API change ke saath contract, SDK aur frontend verification repeat hoti hai.

**Guide verification note:** Official documentation se setup choices cross-check kiye gaye hain. Dependency installation, generated SDK compilation aur live server checks ko apne environment mein run karna hai; neeche diye commands ko run kiye bina project validated assume mat karo.
