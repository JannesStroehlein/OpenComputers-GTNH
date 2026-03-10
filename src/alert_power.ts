import { readAllText } from "./lib/fs_util/init";
import { DiscordEmbed, WebhookMessage } from "./lib/discord_webhook/types";
import { DiscordWebhook } from "./lib/discord_webhook/init";
import * as os from 'os';
import * as component from 'component';
import { GtMachine, LapotronicSupercapacitor } from "./types/gregtech";

const warnPercentage = 80;
const percentageStep = 10;
const alertRole = "1480899370953084978";

function formatSI(value: number): string {
  const units = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
  let unitIndex = 0;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function findCapacitors(): LapotronicSupercapacitor[] {
  const capacitors: LapotronicSupercapacitor[] = [];
  for (const [k, v] of component.list()) {
    if (v === 'gt_machine') {
      const machine = component.proxy(k) as GtMachine;
      if (machine.getName() === 'multimachine.supercapacitor') {
        console.log(`Adding supercapacitor at ${k} to monitoring list.`);
        capacitors.push(machine as LapotronicSupercapacitor);
      }
    }
  }
  return capacitors;
}

function initWebhook(capacitors: LapotronicSupercapacitor[]): DiscordWebhook {
  const webhookUrl = readAllText("./webhook.txt");
  console.log(`Webhook URL loaded.`);

  const emebds: DiscordEmbed[] = capacitors.map(cap => ({
    type: 'rich',
    title: `Monitoring supercapacitor`,
    description: `Address: ${cap.address}\nCapacity: ${formatSI(cap.getEUMaxStored())}EU`,
    color: 0xff00ff,
  }));

  const msg: WebhookMessage = {
    content: `Power Alert initialized`,
    username: 'Power Alert',
    embeds: emebds,
  };

  const webhook = new DiscordWebhook(webhookUrl);
  webhook.send(msg);
  return webhook;
}

function createAlertMessage(cap: LapotronicSupercapacitor): WebhookMessage {
  const percent = (cap.getStoredEU() / cap.getEUMaxStored()) * 100;
  const current = formatSI(cap.getStoredEU());
  const max = formatSI(cap.getEUMaxStored());
  const input = formatSI(cap.getEUInputAverage());
  const output = formatSI(cap.getEUOutputAverage());
  return {
    content: `<@&${alertRole}>\nPower Alert`,
    username: 'Power Alert',
    embeds: [{
      type: 'rich',
      title: 'Power degrading',
      description: `Address: ${cap.address}\nEnergy: ${current}EU / ${max}EU (${percent.toFixed(2)}%)\nInput: ${input}EU\nOutput: ${output}EU`,
      color: 0xff0000,
    }]
  }
}

function createRecoverMessage(cap: LapotronicSupercapacitor): WebhookMessage {
  const percent = (cap.getStoredEU() / cap.getEUMaxStored()) * 100;
  const current = formatSI(cap.getStoredEU());
  const max = formatSI(cap.getEUMaxStored());
  const input = formatSI(cap.getEUInputAverage());
  const output = formatSI(cap.getEUOutputAverage());
  return {
    content: `Power Recovering`,
    username: 'Power Alert',
    embeds: [{
      type: 'rich',
      title: 'Power recovering',
      description: `Address: ${cap.address}\nEnergy: ${current}EU / ${max}EU (${percent.toFixed(2)}%)\nInput: ${input}EU\nOutput: ${output}EU`,
      color: 0x00ff00,
    }]
  }
}

let lastWarnedPercentage = warnPercentage + percentageStep;

function update(webhook: DiscordWebhook, capacitors: LapotronicSupercapacitor[]) {
  for (const cap of capacitors) {
    const storedEU = cap.getStoredEU();
    const maxEU = cap.getEUMaxStored();
    const percentage = (storedEU / maxEU) * 100;

    if (percentage < lastWarnedPercentage - percentageStep && percentage < warnPercentage) {
      lastWarnedPercentage = percentage;
      webhook.send(createAlertMessage(cap));
    } else if (percentage >= lastWarnedPercentage + percentageStep && lastWarnedPercentage <= warnPercentage) {
      lastWarnedPercentage = percentage;
      webhook.send(createRecoverMessage(cap));
    }
  }
}

const capacitors = findCapacitors();
const webhook = initWebhook(capacitors);

while (true) {
  update(webhook, capacitors);
  os.sleep(10);
}
