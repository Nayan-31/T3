import app from "./app.js";

const port = 3000;

app.listen(port, () => {
  console.log(`Users API: http://localhost:${port}/api/users`);
  console.log(`Swagger UI: http://localhost:${port}/swagger`);
  console.log(`Scalar docs: http://localhost:${port}/docs`);
});