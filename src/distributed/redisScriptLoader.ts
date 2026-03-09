import Redis from "ioredis"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class RedisScriptLoader {

  private redis: Redis
  private scripts: Map<string, string> = new Map()

  constructor(redis: Redis) {
    this.redis = redis
  }

  async loadScript(scriptName: string): Promise<string> {

    // If already loaded return cached SHA
    if (this.scripts.has(scriptName)) {
      return this.scripts.get(scriptName)!
    }

    const scriptPath = path.join(
      __dirname,
      "lua",
      `${scriptName}.lua`
    )

    const script = fs.readFileSync(scriptPath, "utf8")

    const sha = await this.redis.script("LOAD", script) as string

    this.scripts.set(scriptName, sha)

    return sha
  }

  getScriptSha(scriptName: string): string {

    const sha = this.scripts.get(scriptName)

    if (!sha) {
      throw new Error(`Redis script "${scriptName}" not loaded`)
    }

    return sha
  }
}