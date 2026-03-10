local ____exports = {}
local ____init = require("lib.fs_util.init")
local readAllText = ____init.readAllText
local webhookUrl = readAllText(nil, "./webhook.txt")
print("Webhook URL loaded: " .. webhookUrl)
return ____exports
