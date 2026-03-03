import * as component from "component";

for (let [com, _] of component.list()) {
  console.log(
    `Got component: ${component.proxy(com)?.address}, type: ${component.type(com)}`,
  );
}

const gtMachine = (component as any).gt_machine;

for (const [key, value] of Object.entries(gtMachine)) {
  console.log(`${key}: ${value}`);
}
