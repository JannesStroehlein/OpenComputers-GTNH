local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____init = require("lib.fs_util.init")
local readAllText = ____init.readAllText
local ____init = require("lib.discord_webhook.init")
local DiscordWebhook = ____init.DiscordWebhook
local webhookUrl = readAllText(nil, "./webhook.txt")
print("Webhook URL loaded.")
local msg = {content = "Hello from Alert Power!", username = "Alert Power", embeds = {{type = "rich", title = "Alert Power", description = "This is a test message sent from Alert Power.", color = 65280}}}
local webhook = __TS__New(DiscordWebhook, webhookUrl)
webhook:send(msg)
return ____exports
