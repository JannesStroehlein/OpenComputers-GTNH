local ____exports = {}
local component = require("component")
for k, v in component.list() do
    if v == "gt_machine" then
        local machine = component.proxy(k)
        print((((k .. ": ") .. v) .. " - ") .. machine:getName())
    else
        print((k .. ": ") .. v)
    end
end
return ____exports
