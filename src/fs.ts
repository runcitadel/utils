import * as fs from "node:fs/promises";
import * as crypto from "node:crypto";
const uint32Bytes = 4;

/**
 * Reads a file with utf-8 encoding into a string
 *
 * @param filePath The path of the file to read
 * @returns The content of the file
 */
export async function readUtf8File(filePath: string): Promise<string> {
    return await fs.readFile(filePath, "utf8");
}

/**
 * Reads a JSON file into an object
 *
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export async function readJsonFile(filePath: string): Promise<unknown> {
    return await readUtf8File(filePath).then(JSON.parse);
}

/**
 * Safely writes into a file (by writing to a temp file, then renaming)
 *
 * @param filePath The path of the file to write
 * @param str The data to write (encoded as a string)
 */
export async function safeWriteFile(
    filePath: string,
    str: string
): Promise<void> {
    const tempFileName = `${filePath}.${crypto
        .randomBytes(uint32Bytes)
        .readUInt32LE(0)}`;

    await fs.writeFile(tempFileName, str);
    try {
        await fs.rename(tempFileName, filePath);
    } catch (err) {
        await fs.unlink(tempFileName);
        throw err;
    }
}

/**
 * Encodes data to JSON and writes it into a file
 *
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 */
export async function writeJsonFile(
    filePath: string,
    obj: unknown
): Promise<void> {
    safeWriteFile(filePath, JSON.stringify(obj));
}
