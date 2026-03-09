import Redis from "ioredis"

export class NodeCoordinator {

  private redis: Redis
  private nodeId: string

  constructor(redis: Redis, nodeId: string) {
    this.redis = redis
    this.nodeId = nodeId
  }

  async registerNode() {

    await this.redis.sadd(
      "rate-limiter:nodes",
      this.nodeId
    )

    console.log("Node registered:", this.nodeId)
  }

  async heartbeat() {

    await this.redis.set(
      `rate-limiter:node:${this.nodeId}`,
      "alive",
      "EX",
      10
    )
  }

  startHeartbeat() {

    setInterval(async () => {

      await this.heartbeat()

    }, 5000)
  }

}