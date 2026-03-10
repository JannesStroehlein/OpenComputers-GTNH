local ____lualib = require("lualib_bundle")
local __TS__NumberToFixed = ____lualib.__TS__NumberToFixed
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____init = require("lib.fs_util.init")
local readAllText = ____init.readAllText
local ____init = require("lib.discord_webhook.init")
local DiscordWebhook = ____init.DiscordWebhook
local os = require("os")
local component = require("component")
local warnPercentage = 80
local percentageStep = 10
local alertRole = "1480899370953084978"
local function formatSI(self, value)
    local units = {
        "",
        "k",
        "M",
        "G",
        "T",
        "P",
        "E"
    }
    local unitIndex = 0
    while value >= 1000 and unitIndex < #units - 1 do
        value = value / 1000
        unitIndex = unitIndex + 1
    end
    return (__TS__NumberToFixed(value, 2) .. " ") .. units[unitIndex + 1]
end
local function findCapacitors(self)
    local capacitors = {}
    for k, v in component.list() do
        if v == "gt_machine" then
            local machine = component.proxy(k)
            if machine:getName() == "multimachine.supercapacitor" then
                print(("Adding supercapacitor at " .. k) .. " to monitoring list.")
                capacitors[#capacitors + 1] = machine
            end
        end
    end
    return capacitors
end
local function initWebhook(self, capacitors)
    local webhookUrl = readAllText(nil, "./webhook.txt")
    print("Webhook URL loaded.")
    local emebds = __TS__ArrayMap(
        capacitors,
        function(____, cap) return {
            type = "rich",
            title = "Monitoring supercapacitor",
            description = ((("Address: " .. cap.address) .. "\nCapacity: ") .. formatSI(
                nil,
                cap:getEUMaxStored()
            )) .. "EU",
            color = 16711935
        } end
    )
    local msg = {content = "Power Alert initialized", username = "Power Alert", embeds = emebds}
    local webhook = __TS__New(DiscordWebhook, webhookUrl)
    webhook:send(msg)
    return webhook
end
local function createAlertMessage(self, cap)
    local percent = cap:getStoredEU() / cap:getEUMaxStored() * 100
    local current = formatSI(
        nil,
        cap:getStoredEU()
    )
    local max = formatSI(
        nil,
        cap:getEUMaxStored()
    )
    local input = formatSI(
        nil,
        cap:getEUInputAverage()
    )
    local output = formatSI(
        nil,
        cap:getEUOutputAverage()
    )
    return {
        content = ("<@&" .. alertRole) .. ">\nPower Alert",
        username = "Power Alert",
        embeds = {{
            type = "rich",
            title = "Power degrading",
            description = ((((((((((("Address: " .. cap.address) .. "\nEnergy: ") .. current) .. "EU / ") .. max) .. "EU (") .. __TS__NumberToFixed(percent, 2)) .. "%)\nInput: ") .. input) .. "EU\nOutput: ") .. output) .. "EU",
            color = 16711680
        }}
    }
end
local function createRecoverMessage(self, cap)
    local percent = cap:getStoredEU() / cap:getEUMaxStored() * 100
    local current = formatSI(
        nil,
        cap:getStoredEU()
    )
    local max = formatSI(
        nil,
        cap:getEUMaxStored()
    )
    local input = formatSI(
        nil,
        cap:getEUInputAverage()
    )
    local output = formatSI(
        nil,
        cap:getEUOutputAverage()
    )
    return {
        content = "Power Recovering",
        username = "Power Alert",
        embeds = {{
            type = "rich",
            title = "Power recovering",
            description = ((((((((((("Address: " .. cap.address) .. "\nEnergy: ") .. current) .. "EU / ") .. max) .. "EU (") .. __TS__NumberToFixed(percent, 2)) .. "%)\nInput: ") .. input) .. "EU\nOutput: ") .. output) .. "EU",
            color = 65280
        }}
    }
end
local lastWarnedPercentage = warnPercentage + percentageStep
local function update(self, webhook, capacitors)
    for ____, cap in ipairs(capacitors) do
        local storedEU = cap:getStoredEU()
        local maxEU = cap:getEUMaxStored()
        local percentage = storedEU / maxEU * 100
        if percentage < lastWarnedPercentage - percentageStep and percentage < warnPercentage then
            lastWarnedPercentage = percentage
            webhook:send(createAlertMessage(nil, cap))
        elseif percentage >= lastWarnedPercentage + percentageStep and lastWarnedPercentage <= warnPercentage then
            lastWarnedPercentage = percentage
            webhook:send(createRecoverMessage(nil, cap))
        end
    end
end
local capacitors = findCapacitors(nil)
local webhook = initWebhook(nil, capacitors)
while true do
    update(nil, webhook, capacitors)
    os.sleep(10)
end
return ____exports
