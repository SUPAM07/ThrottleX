local key = KEYS[1]

local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local currentWindow = math.floor(now / window)
local previousWindow = currentWindow - 1

local currentKey = key .. ":" .. currentWindow
local previousKey = key .. ":" .. previousWindow

local currentCount = tonumber(redis.call("GET", currentKey) or "0")
local previousCount = tonumber(redis.call("GET", previousKey) or "0")

local elapsed = now % window
local weight = (window - elapsed) / window

local total = currentCount + previousCount * weight

if total >= limit then
    return 0
end

currentCount = redis.call("INCR", currentKey)

if currentCount == 1 then
    redis.call("EXPIRE", currentKey, window * 2)
end

return 1