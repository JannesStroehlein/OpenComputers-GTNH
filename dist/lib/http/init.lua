local internet = require("internet")

local ____exports = {}

--- Fetches a resource from the specified URL.
---@param url string The URL of the resource to fetch.
---@param bodyString string The body of the request.
---@param headersTable Record<string, string> The headers for the request.
---@param method string The HTTP method for the request.
---@return string, number, string, Record<string, string> The response body, status code, status message, and response headers.
function ____exports.fetch(url, bodyString, headersTable, method)
    local handle = internet.request(url, bodyString, headersTable, method)
    local result = ""
    for chunk in handle do
        result = result .. chunk
    end
    -- Print the body of the HTTP response
    -- print(result)

    -- Grab the metatable for the handle. This contains the
    -- internal HTTPRequest object.
    local mt = getmetatable(handle)

    -- The response method grabs the information for
    -- the HTTP response code, the response message, and the
    -- response headers.
    local code, message, headers = mt.__index.response()
    return result, code, message, headers
end

return ____exports
