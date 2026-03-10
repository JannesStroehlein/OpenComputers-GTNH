import * as internet from "internet";
import * as fs from "filesystem";
import { readAllText } from "./lib/fs_util/init";

const webhookUrl = readAllText("./webhook.txt");
console.log(`Webhook URL loaded: ${webhookUrl}`);
