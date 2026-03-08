local ____exports = {}
local component = require("component")
for k, v in component.list() do
    if v == "me_interface" then
        print((k .. ": ") .. v)
        local proxy = component.proxy(k)
        print("Network Power: " .. tostring(proxy:getStoredPower()))
        local index = 0
        local iter = proxy:allItems()
        while true do
            local item = iter(nil)
            if not item then
                print("No more items.")
                break
            end
            print((("- " .. item.name) .. " x") .. tostring(item.size))
            index = index + 1
            if index >= 20 then
                print("...and a lot more items.")
                break
            end
        end
    end
end
return ____exports
