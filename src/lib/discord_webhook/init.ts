import { WebhookMessage } from "./types";
import * as JSON from "lib.json.init";
import { fetch } from "../http/init";

export class DiscordWebhook {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Send a message to the Discord webhook.
   * @param options The message options to send, which should conform to the `WebhookMessage` interface. At least one of `content`, `files`, `embeds`, or `poll` should be provided.
   * @throws Will throw an error if the HTTP request fails or if the response status code indicates an error.
   */
  async send(options: WebhookMessage) {
    const body = JSON.encode(options);
    const headers = { ["Content-Type"]: "application/json" };
    const [response, statusCode, statusMessage, responseHeaders] = fetch(
      this.url,
      body,
      headers,
      "POST",
    );

    if (statusCode < 200 || statusCode >= 300) {
      const statusMessageString = statusMessage ? statusMessage.toString() : "";
      const responseString = response ? response.toString() : "";
      throw new Error(
        `Failed to send webhook message: ${statusCode}: ${statusMessageString} - ${responseString}`,
      );
    }
  }
}
