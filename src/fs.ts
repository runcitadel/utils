import * as fs from "fs/promises";
import * as crypto from "crypto";
import YAML from "yaml";
import { Stream } from "stream";
const uint32Bytes = 4;

export type writeableData =
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream;

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
 * Reads a YAML file into an object
 *
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export async function readYamlFile(filePath: string): Promise<unknown> {
    return YAML.parse(await readUtf8File(filePath));
}

/**
 * Reads a JSON file into an object
 *
 * This is just readYamlFile, because YAML is a superset of JSON,
 * so every YAML parser can parse JSON.
 *
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export const readJsonFile = readYamlFile;

/**
 * Safely writes into a file (by writing to a temp file, then renaming)
 *
 * @param filePath The path of the file to write
 * @param data The data to write (encoded as a string)
 */
export async function safeWriteFile(
    filePath: string,
    data: writeableData
): Promise<void> {
    const tempFileName = `${filePath}.${crypto
        .randomBytes(uint32Bytes)
        .readUInt32LE(0)}`;

    await fs.writeFile(tempFileName, data);
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

/**
 * Encodes data to YAML and writes it into a file
 *
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 */
export async function writeYamlFile(
    filePath: string,
    obj: unknown
): Promise<void> {
    safeWriteFile(filePath, YAML.stringify(obj));
}

/**
 * Touch a file, creating it if it doesn't exist, otherwise updating its modified time
 * @param filePath The path of the file to touch
 */
export async function touch(
    filePath: string
): Promise<NodeJS.ErrnoException | void> {
    const time = new Date();
    try {
        await fs.utimes(filePath, time, time);
    } catch {
        await (await fs.open(filePath, "w")).close();
    }
}

/**
 * Touches a file to make sure it exists, and then writes data into it using {@link safeWriteFile}
 *
 * @param filePath The path of the file to write
 * @param data The data to be written into the file
 */
export async function ensureWriteFile(
    filePath: string,
    data: writeableData
): Promise<NodeJS.ErrnoException | void> {
    await touch(filePath);
    await safeWriteFile(filePath, data);
}

// Export the promise-based version of the fs module, not the callback-based one
export * from "fs/promises";
// Export all synchronous functions from fs
export {
    accessSync,
    appendFileSync,
    chmodSync,
    chownSync,
    closeSync,
    copyFileSync,
    existsSync,
    fchmodSync,
    fchownSync,
    fdatasyncSync,
    fstatSync,
    fsyncSync,
    ftruncateSync,
    futimesSync,
    lchmodSync,
    lchownSync,
    linkSync,
    lstatSync,
    lutimesSync,
    mkdirSync,
    mkdtempSync,
    openSync,
    opendirSync,
    readFileSync,
    readSync,
    readdirSync,
    readlinkSync,
    readvSync,
    realpathSync,
    renameSync,
    rmSync,
    rmdirSync,
    statSync,
    symlinkSync,
    truncateSync,
    unlinkSync,
    utimesSync,
    writeFileSync,
    writeSync,
    writevSync,
} from "fs";
