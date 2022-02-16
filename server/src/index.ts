import cluster from "cluster";
import * as dotenv from "dotenv";
import { cpus } from "os";
import path from "path";
import { Config } from "./config/config";
import { commandData } from "./passport/facebook";
import { server } from "./services/server";

const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

export const PORT =
  commandData[0] &&
  commandData[0].length === 4 &&
  !isNaN(Number(commandData[0]))
    ? Number(commandData[0])
    : Config.PORT; // Checking if the
// first command argument is valid to use as PORT number.
export const CPUs = cpus().length;

if (Config.MODE === "FORK") {
  server.listen(PORT, () => {
    console.log(`Server hosted at PORT: ${PORT}`);
  });
} else {
  if (cluster.isMaster) {
    console.log(`Primary process ${process.pid}`);
    for (let i = 0; i < CPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died.`);
      cluster.fork();
    });
  } else {
    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} server hosted at port ${PORT}`);
    }); // Express server
  }
}

/**
 *
 *
 * Auth JWT Sign Up.
 *
 *
 */
