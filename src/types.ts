/* Common Types used in Umbrel/Citadel */
type Dependency = "bitcoind" | "electrum" | "lnd";

/**
 * Defines an app
 */
export type app = {
    /** The id of the app, the name as a simple string without spaces */
    id: string;
    /** A category for the app, used for grouping apps on the dashboard */
    category: string;
    /** The name of the app */
    name: string;
    /** The version of the app */
    version: string;
    /** A One line description of the app (max 50 characters) */
    tagline: string;
    /** A longer description of the app (50 to 200 words) */
    description: string;
    /** The person(s) who created the app */
    developer: string;
    /** The url to the app's website */
    website: string;
    /** The dependencies of the app */
    dependencies: Dependency[];
    /** The url to the app's Git repository */
    repo: string;
    /** The url to the app's support website/chat */
    support: string;
    /** The port the app's web UI uses */
    port: number;
    /** A list of links to app promotional images, if no domain is provided, https://getumbrel.github.io/umbrel-apps-gallery/${app.id}/ will be put in front of the path */
    gallery: string[];
    /** The path of the app the open button should open */
    path: string;
    /** The app's default password */
    defaultPassword: string;
    /** Automatically added */
    hiddenService?: string;
    /** Automatically added */
    installed?: boolean;
};

/** Queries which can be used to only list specific apps */
export type appQuery = {
    /** If the apps should be installed */
    installed?: boolean;
    /** The category the apps should be in */
    category?: string;
};

/** A user.json file on Umbrel. Some data may automatically be added and not actually in the file */
export type user = {
    /** The user's name */
    name: string;
    /** The users password, hashed by bcrypt */
    password?: string;
    /** The users password in plain text, only added at runtime, never stored in a file */
    plainTextPassword?: string;
    /** The users mnemoic LND seed */
    seed?: string | Buffer | ArrayBuffer;
    /** The list of IDs of installed apps */
    installedApps?: string[];
};

type BuildPowersOf2LengthArrays<
    N extends number,
    R extends never[][]
> = R[0][N] extends never
    ? R
    : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

type ConcatLargestUntilDone<
    N extends number,
    R extends never[][],
    B extends never[]
> = B["length"] extends N
    ? B
    : [...R[0], ...B][N] extends never
    ? ConcatLargestUntilDone<
          N,
          R extends [R[0], ...infer U]
              ? U extends never[][]
                  ? U
                  : never
              : never,
          B
      >
    : ConcatLargestUntilDone<
          N,
          R extends [R[0], ...infer U]
              ? U extends never[][]
                  ? U
                  : never
              : never,
          [...R[0], ...B]
      >;

type Replace<R extends unknown[], T> = { [K in keyof R]: T };

type TupleOf<T, N extends number> = number extends N
    ? T[]
    : {
          [K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
              ? U extends never[][]
                  ? Replace<ConcatLargestUntilDone<K, U, []>, T>
                  : never
              : never;
      }[N];

export type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>["length"];

export type RangeOf2<From extends number, To extends number> =
    | Exclude<RangeOf<To>, RangeOf<From>>
    | From;

/** An update status file */
export type updateStatus = {
    state: "installing" | "success" | "failed";
    progress: RangeOf2<0, 100>;
    description: string;
    updateTo?: string;
};

export type versionFile = {
    version: string;
    name: string;
    requires: string;
    notes: string;
};

export type backupStatus = {
    status: string;
    /** A unix timestamp of when the backup was created */
    timestamp: number;
};

export type debugStatus = {
    status: "processing" | "success";
    debug: string;
    /** The dmesg logs */
    dmesg: string;
};
