import Logger from 'pino';

export class zLoggerUtil {
    private static log = Logger({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            },
            levels: {
                silent: Infinity,
                fatal: 100,
                error: 90,
                warn: 60,
                info: 40,
                debug: 20,
                trace: 10
            },
        },
        timestamp: () => new Date().toLocaleString().replace(',', ''),
    });

    private constructor() { }

    public static silent(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.silent(obj, msg, args);
    }

    public static fatal(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.fatal(obj, msg, args);
    }

    public static error(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.error(obj, msg, args);
    }

    public static warn(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.warn(obj, msg, args);
    }

    public static info(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.info(obj, msg, args);
    }

    public static debug(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.debug(obj, msg, args);
    }

    public static trace(obj: object, msg?: string | undefined, ...args: any[]): void {
        zLoggerUtil.log.trace(obj, msg, args);
    }
}
