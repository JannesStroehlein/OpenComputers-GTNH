local ____exports = {}
local component = require("component")
local os = require("os")
local function printStats(self, supercapacitor)
    print("Name: " .. supercapacitor:getName())
    print("Address: " .. supercapacitor.address)
    print(("Input Voltage: " .. tostring(supercapacitor:getInputVoltage())) .. " EU/p")
    print(("Output Voltage: " .. tostring(supercapacitor:getOutputVoltage())) .. " EU/p")
    print(("Stored EU: " .. supercapacitor:getStoredEUString()) .. " EU")
    print(("EU Capacity: " .. tostring(supercapacitor:getEUCapacity())) .. " EU")
    print(("Steam Capacity: " .. tostring(supercapacitor:getSteamCapacity())) .. " EU")
    print(("Stored Steam: " .. tostring(supercapacitor:getStoredSteam())) .. " EU")
    print(("EU Output Average: " .. tostring(supercapacitor:getEUOutputAverage())) .. " EU/p")
end
local function printCapStats(self, gpu, name, yStart, screenWidth, cap)
    local mainCapStoredEU = cap:getStoredEU()
    local mainCapMaxEU = cap:getEUMaxStored()
    local mainCapBarLength = math.floor(mainCapStoredEU / mainCapMaxEU * (screenWidth - 20))
    gpu.setForeground(16777215)
    gpu.set(
        1,
        yStart,
        ((((name .. ": ") .. tostring(mainCapStoredEU)) .. " / ") .. tostring(mainCapMaxEU)) .. " EU"
    )
    gpu.setForeground(65280)
    gpu.fill(
        1,
        yStart + 1,
        mainCapBarLength,
        1,
        "█"
    )
    gpu.setForeground(5592405)
    gpu.fill(
        1 + mainCapBarLength,
        yStart + 1,
        screenWidth - 20 - mainCapBarLength,
        1,
        "█"
    )
end
local function printDashBoard(self, mainCap, smallCap, gpu, screen)
    gpu.bind(screen.address)
    local screenWidth, screenHeight = gpu.getResolution()
    gpu.setResolution(screenWidth, screenHeight)
    gpu.setBackground(0)
    gpu.setForeground(16777215)
    gpu.fill(
        1,
        1,
        screenWidth,
        screenHeight,
        " "
    )
    printCapStats(
        nil,
        gpu,
        "Main Capacitor",
        2,
        screenWidth,
        mainCap
    )
    printCapStats(
        nil,
        gpu,
        "Small Capacitor",
        5,
        screenWidth,
        smallCap
    )
end
local mainCapId = "7d4534b5-1795-4d73-b53d-2e8467be4805"
local smallCapId = "15766f0c-e339-483b-a2da-005fd139a4d4"
local smallCap = component.proxy(smallCapId)
local mainCap = component.proxy(mainCapId)
local gpu = component.gpu
local screen = component.screen
while true do
    printDashBoard(
        nil,
        mainCap,
        smallCap,
        gpu,
        screen
    )
    os.sleep(1)
end
return ____exports
