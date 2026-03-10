# Lua JSON Library

https://github.com/i-am-dies/OpenComputers/blob/master/lib/json.lua

To install this use the following commands in the OpenOS shell:

```sh
mkdir -p /lib/json
wget https://raw.githubusercontent.com/rxi/json.lua/refs/heads/master/json.lua -O /lib/json/init.lua
```

## Usage

To use the library in your ts script it needs to be imported in a specific way to ensure that the transpiler emits the correct Lua code.

Use this example as a template for how to import the library:

```ts
import * as JSON from "lib.json.init";

const obj = { hello: "world" };
const jsonString = JSON.encode(obj);
console.log(jsonString); // Output: {"hello":"world"}
```
