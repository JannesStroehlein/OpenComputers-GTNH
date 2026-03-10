local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.DiscordWebhook = __TS__Class()
local DiscordWebhook = ____exports.DiscordWebhook
DiscordWebhook.name = "DiscordWebhook"
function DiscordWebhook.prototype.____constructor(self, url)
    self.url = url
end
return ____exports
