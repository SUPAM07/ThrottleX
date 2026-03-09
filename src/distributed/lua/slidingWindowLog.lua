local key = KEYS[1]

local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- remove expired entries
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

-- get current request count
local count = redis.call("ZCARD", key)

if count >= limit then
    return 0
end

-- add new request
redis.call("ZADD", key, now, now)

-- ensure key expires
redis.call("EXPIRE", key, window)

return 1