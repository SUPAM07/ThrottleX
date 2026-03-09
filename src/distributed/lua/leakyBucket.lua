local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local leakRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call("HMGET", key, "water", "timestamp")

local water = tonumber(bucket[1])
local last = tonumber(bucket[2])

if water == nil then
    water = 0
    last = now
end

local leaked = (now - last) * leakRate
water = math.max(0, water - leaked)

if water >= capacity then
    return 0
end

water = water + 1

redis.call("HMSET", key,
    "water", water,
    "timestamp", now
)

redis.call("EXPIRE", key, 60)

return 1