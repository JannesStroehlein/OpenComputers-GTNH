import * as component from "component";
import { MeInterface } from "./types/appeng";

for (const [k, v] of component.list()) {
    if (v === "me_interface") {
        console.log(`${k}: ${v}`);
        const proxy = component.proxy(k) as MeInterface;
        console.log(`Network Power: ${proxy.getStoredPower()}`);
        let index = 0;
        const iter = proxy.allItems();
        while (true) {
            const item = iter();
            if (!item) {
                console.log('No more items.');
                break;
            }

            console.log(`- ${item.name} x${item.size}`);
            if (++index >= 20) {
                console.log(`...and a lot more items.`);
                break;
            }
        }
    }
}
