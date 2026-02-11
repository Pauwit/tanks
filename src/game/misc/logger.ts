export enum LogLevel {
    LOG,
    WARNING,
    ERROR,
}

export class Logger {
    private static Instance: Logger = new Logger(LogLevel.LOG);

    private _logLevel: LogLevel;

    private constructor(logLevel: LogLevel) {
        this._logLevel = logLevel;
    }

    public static get logLevel(): LogLevel {
        return this.Instance._logLevel;
    }

    public static set logLevel(logLevel: LogLevel) {
        this.Instance._logLevel = logLevel;
    }

    private static getCaller(): string | undefined {
        const stack = new Error().stack;
        if (!stack) return undefined;

        const line = stack.split("\n")[2];
        if (!line) return undefined;

        // Match both the function name and file:line:column
        const match = line.match(/at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) || line.match(/(.*?)@(.*):(\d+):(\d+)/);

        if (!match) return undefined;

        const [, funcName, filePath, lineNum, colNum] = match;

        // Extract just the filename from the file path
        const fileName = filePath.split("/").pop()?.split("?")[0]; // remove query string

        return `${fileName}:${lineNum}:${colNum} : ${funcName}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static log(title: string | null, ...args: any[]) {
        if (this.Instance._logLevel > LogLevel.LOG) return;
        if (!title) {
            console.log(`[LOG] (${this.getCaller()})`, ...args);
        } else {
            console.log(`[LOG] (${this.getCaller()}) ${title} -`, ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static warn(title: string | null, ...args: any[]) {
        if (this.Instance._logLevel > LogLevel.WARNING) return;
        if (!title) {
            console.warn(`[WAR] (${this.getCaller()})`, ...args);
        } else {
            console.warn(`[WAR] (${this.getCaller()}) ${title} -`, ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static error(title: string | null, ...args: any[]) {
        if (this.Instance._logLevel > LogLevel.ERROR) return;
        if (!title) {
            console.error(`[ERR] (${this.getCaller()})`, ...args);
        } else {
            console.error(`[ERR] (${this.getCaller()}) ${title} -`, ...args);
        }
    }
}