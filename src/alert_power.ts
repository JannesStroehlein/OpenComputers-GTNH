import { readAllText } from "./lib/fs_util/init";
import { WebhookMessage } from "./lib/discord_webhook/types";
import { DiscordWebhook } from "./lib/discord_webhook/init";

const webhookUrl = readAllText("./webhook.txt");
console.log(`Webhook URL loaded.`);

const msg: WebhookMessage = {
  content: "Hello from Alert Power!",
  username: "Alert Power",
  embeds: [
    {
      type: "rich",
      title: "Alert Power",
      description: "This is a test message sent from Alert Power.",
      color: 0x00ff00,
    },
  ],
};

const webhook = new DiscordWebhook(webhookUrl);
webhook.send(msg);
