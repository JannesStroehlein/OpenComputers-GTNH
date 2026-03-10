local ____lualib = require("lualib_bundle")
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__StringTrim = ____lualib.__TS__StringTrim
local __TS__StringSplit = ____lualib.__TS__StringSplit
local ____exports = {}
local fs = require("filesystem")
local shell = require("shell")
--- Idempotent function to convert a relative path to an absolute path.
-- If the input path is already absolute, it returns it unchanged (thanks Copilot if only there was a word for that).
-- 
-- @param path The relative or absolute path to convert.
-- @returns The absolute path corresponding to the input path.
-- @throws Will throw an error if the input path is empty.
function ____exports.toAbsolutePath(self, path)
    if not path then
        error(
            __TS__New(Error, "Path cannot be empty"),
            0
        )
    end
    if __TS__StringStartsWith(path, "/") then
        return path
    end
    return fs.canonical(fs.concat(
        shell.getWorkingDirectory(),
        path
    ))
end
--- Reads the entire content of a text file and returns it as a string.
-- 
-- @param filePath The path to the text file to read.
-- @returns The content of the text file.
-- @throws Will throw an error if the file does not exist or cannot be read.
function ____exports.readAllText(self, filePath)
    local absolutePath = ____exports.toAbsolutePath(nil, filePath)
    if not fs.exists(absolutePath) then
        error(
            __TS__New(Error, "File not found: " .. filePath),
            0
        )
    end
    local file = fs.open(absolutePath, "r")
    local content = ""
    local tmp
    while true do
        tmp = file:read(128)
        if not (tmp ~= nil) then
            break
        end
        content = content .. tostring(tmp)
    end
    file:close()
    return __TS__StringTrim(content)
end
--- Reads the content of a text file and returns it as an array of lines.
-- 
-- @param filePath The path to the text file to read.
-- @returns An array of lines from the text file.
-- @throws Will throw an error if the file does not exist or cannot be read.
function ____exports.readAllLines(self, filePath)
    local text = ____exports.readAllText(nil, filePath)
    return __TS__StringSplit(text, nil)
end
return ____exports
