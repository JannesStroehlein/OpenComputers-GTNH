/**
 * Bindings for the Lua JSON library.
 * This is a hacky solutions to make the transpiler import the lua JSON library (/home/lib/json/init.lua) as a module.
 */
declare module "lib.json.init" {
  /**
   * Encode Lua table / JS object into a JSON string.
   * This function belongs to the Lua JSON module table.
   */
  export function encode(value: unknown): string;

  /**
   * Decode JSON string into Lua table / JS object.
   * This function belongs to the Lua JSON module table.
   */
  export function decode(json: string): unknown;
}
