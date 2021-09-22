import * as fs from "fs/promises";
import * as fsSync from "fs";
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
 * Synchronously reads a file with utf-8 encoding into a string
 *
 * @param filePath The path of the file to read
 * @returns The content of the file
 */
export function readUtf8FileSync(filePath: string): string {
    return fsSync.readFileSync(filePath, "utf8");
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
 * Synchronously reads a YAML file into an object
 *
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export function readYamlFileSync(filePath: string): Promise<unknown> {
    return YAML.parse(readUtf8FileSync(filePath));
}

/**
 * Reads a JSON file into an object
 *
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export async function readJSONFile(filePath: string): Promise<unknown> {
    return JSON.parse(await readUtf8File(filePath));
}

/**
 * Synchronously reads a JSON file into an object
 * @param filePath The path of the file to read
 * @returns The parsed content of the file
 */
export function readJSONFileSync(filePath: string): unknown {
    return JSON.parse(readUtf8FileSync(filePath));
}

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
 * Synchronously and safely writes into a file (by writing to a temp file, then renaming)
 * @param filePath The path of the file to write
 * @param data The data to write (encoded as a string)
 */
export function safeWriteFileSync(
    filePath: string,
    data: string | NodeJS.ArrayBufferView
): void {
    const tempFileName = `${filePath}.${crypto
        .randomBytes(uint32Bytes)
        .readUInt32LE(0)}`;
    fsSync.writeFileSync(tempFileName, data);
    try {
        fsSync.renameSync(tempFileName, filePath);
    } catch (err) {
        fsSync.unlinkSync(tempFileName);
        throw err;
    }
}

/**
 * Encodes data to JSON and writes it into a file
 *
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 * @param safe Whether to use safeWriteFile or writeFileSync
 */
export async function writeJsonFile(
    filePath: string,
    obj: unknown,
    safe = true
): Promise<void> {
    if (safe) {
        safeWriteFile(filePath, JSON.stringify(obj));
    } else {
        fsSync.writeFileSync(filePath, JSON.stringify(obj));
    }
}

/**
 * Synchronously encodes data to JSON and writes it into a file
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 * @param safe Whether to use safeWriteFile or writeFileSync
 */
export function writeJsonFileSync(
    filePath: string,
    obj: unknown,
    safe = true
): void {
    if (safe) {
        safeWriteFileSync(filePath, JSON.stringify(obj));
    } else {
        fsSync.writeFileSync(filePath, JSON.stringify(obj));
    }
}

/**
 * Encodes data to YAML and writes it into a file
 *
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 * @param safe Whether to use safeWriteFile or writeFileSync
 */
export async function writeYamlFile(
    filePath: string,
    obj: unknown,
    safe = true
): Promise<void> {
    if (safe) {
        safeWriteFile(filePath, YAML.stringify(obj));
    } else {
        fsSync.writeFileSync(filePath, YAML.stringify(obj));
    }
}

/**
 * Synchronously encodes data to YAML and writes it into a file
 * @param filePath The path of the file to write
 * @param obj The data to be written into the file (as an object)
 * @param safe Whether to use safeWriteFile or writeFileSync
 */
export function writeYamlFileSync(
    filePath: string,
    obj: unknown,
    safe = true
): void {
    if (safe) {
        safeWriteFileSync(filePath, YAML.stringify(obj));
    } else {
        fsSync.writeFileSync(filePath, YAML.stringify(obj));
    }
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
 * Synchronously touch a file, creating it if it doesn't exist, otherwise updating its modified time
 * @param filePath The path of the file to touch
 */
export function touchSync(filePath: string): void {
    const time = new Date();
    try {
        fsSync.utimesSync(filePath, time, time);
    } catch {
        fsSync.closeSync(fsSync.openSync(filePath, "w"));
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

/**
 * Synchronously touches a file to make sure it exists, and then writes data into it using {@link safeWriteFileSync}
 *
 * @param filePath The path of the file to write
 * @param data The data to be written into the file
 */
export function ensureWriteFileSync(
    filePath: string,
    data: string | NodeJS.ArrayBufferView
): void {
    touchSync(filePath);
    safeWriteFileSync(filePath, data);
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
    cpSync,
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

// Other useful functions which aren't synchrounous versions of async functions
export { createReadStream, createWriteStream, watch, watchFile } from "fs";

// Other useful classes & interfaces
export {
    BigIntOptions,
    BigIntStats,
    BufferEncodingOption,
    CopyOptions,
    Dir,
    Dirent,
    EncodingOption,
    FSWatcher,
    MakeDirectoryOptions,
    Mode,
    ObjectEncodingOptions,
    OpenDirOptions,
    OpenMode,
    PathLike,
    PathOrFileDescriptor,
    ReadPosition,
    ReadStream,
    ReadSyncOptions,
    ReadVResult,
    RmDirOptions,
    RmOptions,
    StatOptions,
    StatSyncFn,
    StatSyncOptions,
    Stats,
    StatsBase,
    TimeLike,
    WatchEventType,
    WatchListener,
    WatchOptions,
    WriteFileOptions,
    WriteStream,
    WriteVResult,
} from "fs";
