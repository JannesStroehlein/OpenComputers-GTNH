local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local JSON = require("lib.json.init")
local ____init = require("lib.http.init")
local fetch = ____init.fetch
____exports.DiscordWebhook = __TS__Class()
local DiscordWebhook = ____exports.DiscordWebhook
DiscordWebhook.name = "DiscordWebhook"
function DiscordWebhook.prototype.____constructor(self, url)
    self.url = url
end
function DiscordWebhook.prototype.send(self, options)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local body = JSON:encode(options)
        local headers = {["Content-Type"] = "application/json"}
        local response, statusCode, statusMessage, responseHeaders = table.unpack(
            fetch(self.url, body, headers, "POST"),
            1,
            4
        )
        if statusCode < 200 or statusCode >= 300 then
            local ____statusMessage_0
            if statusMessage then
                ____statusMessage_0 = tostring(statusMessage)
            else
                ____statusMessage_0 = ""
            end
            local statusMessageString = ____statusMessage_0
            local ____response_1
            if response then
                ____response_1 = tostring(response)
            else
                ____response_1 = ""
            end
            local responseString = ____response_1
            error(
                __TS__New(
                    Error,
                    (((("Failed to send webhook message: " .. tostring(statusCode)) .. ": ") .. statusMessageString) .. " - ") .. responseString
                ),
                0
            )
        end
    end)
end
return ____exports
