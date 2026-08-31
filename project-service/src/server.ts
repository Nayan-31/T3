import app from "./app/app.js";
import { connectDb } from "./config/database.js";
import { startIdleReaper } from "./services/activity.service.js";
import { env } from "./config/env.js";
import { connectMessageBroker } from "./services/broker.service.js";
await connectDb();
await startIdleReaper();
await connectMessageBroker()


app.listen(env.PORT, () => {
  console.log(`Project server is running on port ${env.PORT}`);
});
