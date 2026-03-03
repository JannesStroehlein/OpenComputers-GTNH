import * as component from "component";
import * as os from "os";
import { LapotronicSupercapacitor } from "./types/gregtech";

function printStats(supercapacitor: LapotronicSupercapacitor) {
  console.log(`Name: ${supercapacitor.getName()}`);
  console.log(`Address: ${supercapacitor.address}`);
  console.log(`Input Voltage: ${supercapacitor.getInputVoltage()} EU/p`);
  console.log(`Output Voltage: ${supercapacitor.getOutputVoltage()} EU/p`);
  console.log(`Stored EU: ${supercapacitor.getStoredEUString()} EU`);
  console.log(`EU Capacity: ${supercapacitor.getEUCapacity()} EU`);
  console.log(`Steam Capacity: ${supercapacitor.getSteamCapacity()} EU`);
  console.log(`Stored Steam: ${supercapacitor.getStoredSteam()} EU`);
  console.log(`EU Output Average: ${supercapacitor.getEUOutputAverage()} EU/p`);
}

function printCapStats(
  gpu: ComponentGpu,
  name: string,
  yStart: number,
  screenWidth: number,
  cap: LapotronicSupercapacitor,
) {
  const mainCapStoredEU = cap.getStoredEU();
  const mainCapMaxEU = cap.getEUMaxStored();
  const mainCapBarLength = Math.floor(
    (mainCapStoredEU / mainCapMaxEU) * (screenWidth - 20),
  );
  gpu.setForeground(0xffffff);
  gpu.set(1, yStart, `${name}: ${mainCapStoredEU} / ${mainCapMaxEU} EU`);
  gpu.setForeground(0x00ff00);
  gpu.fill(1, yStart + 1, mainCapBarLength, 1, "█");
  gpu.setForeground(0x555555);
  gpu.fill(
    1 + mainCapBarLength,
    yStart + 1,
    screenWidth - 20 - mainCapBarLength,
    1,
    "█",
  );
}

function printDashBoard(
  mainCap: LapotronicSupercapacitor,
  smallCap: LapotronicSupercapacitor,
  gpu: ComponentGpu,
  screen: ComponentScreen,
) {
  gpu.bind(screen.address);
  const [screenWidth, screenHeight] = gpu.getResolution();
  gpu.setResolution(screenWidth, screenHeight);
  gpu.setBackground(0x000000);
  gpu.setForeground(0xffffff);
  gpu.fill(1, 1, screenWidth, screenHeight, " ");

  // Main capacitor
  printCapStats(gpu, "Main Capacitor", 2, screenWidth, mainCap);

  // Small capacitor
  printCapStats(gpu, "Small Capacitor", 5, screenWidth, smallCap);
}

const mainCapId = "7d4534b5-1795-4d73-b53d-2e8467be4805";
const smallCapId = "15766f0c-e339-483b-a2da-005fd139a4d4";

const smallCap = component.proxy(smallCapId) as LapotronicSupercapacitor;
const mainCap = component.proxy(mainCapId) as LapotronicSupercapacitor;

const gpu = (component as any).gpu as ComponentGpu;
const screen = (component as any).screen as ComponentScreen;

while (true) {
  printDashBoard(mainCap, smallCap, gpu, screen);
  os.sleep(1);
}
