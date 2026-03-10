import * as fs from "filesystem";
import * as shell from "shell";

/**
 * Idempotent function to convert a relative path to an absolute path.
 * If the input path is already absolute, it returns it unchanged (thanks Copilot if only there was a word for that).
 * @param path The relative or absolute path to convert.
 * @returns The absolute path corresponding to the input path.
 *
 * @throws Will throw an error if the input path is empty.
 */
export function toAbsolutePath(path: string): string {
  if (!path) {
    throw new Error("Path cannot be empty");
  }

  if (path.startsWith("/")) {
    return path; // Already an absolute path
  }

  // Combine the current working directory with the relative path and canonicalize it
  return fs.canonical(fs.concat(shell.getWorkingDirectory(), path));
}

/**
 * Reads the entire content of a text file and returns it as a string.
 * @param filePath The path to the text file to read.
 * @returns The content of the text file.
 *
 * @throws Will throw an error if the file does not exist or cannot be read.
 */
export function readAllText(filePath: string): string {
  const absolutePath = toAbsolutePath(filePath);

  if (!fs.exists(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const file = fs.open(absolutePath, "r") as unknown as fs.File;
  let content: string = "";
  let tmp: string | LuaMultiReturn<[null, string]>;
  while ((tmp = file.read(128)) !== null) {
    content += tmp;
  }
  file.close();
  return content.trim();
}

/**
 * Reads the content of a text file and returns it as an array of lines.
 * @param filePath The path to the text file to read.
 * @returns An array of lines from the text file.
 *
 * @throws Will throw an error if the file does not exist or cannot be read.
 */
export function readAllLines(filePath: string): string[] {
  const text = readAllText(filePath);
  return text.split("\n").map((line) => line.trim());
}
