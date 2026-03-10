import * as component from 'component';
import { GtMachine } from './types/gregtech';

for (const [k, v] of component.list()) {
  if (v === 'gt_machine') {
    const machine = component.proxy(k) as GtMachine;
    console.log(`${k}: ${v} - ${machine.getName()}`);
  } else {
    console.log(`${k}: ${v}`);
  }
}
