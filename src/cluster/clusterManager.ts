import cluster from "cluster"
import os from "os"

const numCPUs = os.cpus().length

export function startCluster() {

  if (cluster.isPrimary) {

    console.log(`Master ${process.pid} running`)

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

  } else {

    console.log(`Worker ${process.pid} started`)

    require("../server/server")

  }

}