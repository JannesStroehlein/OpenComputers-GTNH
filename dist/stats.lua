local ____lualib = require("lualib_bundle")
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local ____exports = {}
local component = require("component")
for com, _ in component.list() do
    local ____opt_0 = component.proxy(com)
    print((("Got component: " .. (____opt_0 and ____opt_0.address)) .. ", type: ") .. component.type(com))
end
local gtMachine = component.gt_machine
for ____, ____value in ipairs(__TS__ObjectEntries(gtMachine)) do
    local key = ____value[1]
    local value = ____value[2]
    print((tostring(key) .. ": ") .. tostring(value))
end
return ____exports
