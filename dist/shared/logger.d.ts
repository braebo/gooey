import { CSSColorName } from "./css-colors.js";

//#region src/shared/logger.d.ts
interface LoggerOptions {
  /**
   * Whether to use the styled logger or the regular console.log.
   * @default true
   */
  styled?: boolean;
  /**
   * Whether to defer the log to the next idle state.  Disabled on Safari to avoid crashing.
   * @default true
   */
  deferred?: boolean;
  /**
   * The foreground color of the log.
   * @default randomColor()
   */
  fg?: CSSColorName | (string & {});
  /**
   * The background color of the log.
   * @default transparent
   */
  bg?: CSSColorName | (string & {});
  /**
   * Any additional CSS to apply to the log.
   * @default ''
   */
  css?: string;
  /**
   * Run the logger on the server.
   * @default false
   * TODO This didn't work when I just tried it in a Vitest environment.. isn't being applied properly.
   */
  server?: boolean;
  /**
   * Run the logger in the browser.
   * @default true
   */
  browser?: boolean;
  /**
   * Whether to only run the logger in development mode.
   * @default true
   * TODO Not yet implemented.
   */
  devOnly?: boolean;
  /**
   * Print's the url of the file that called the logger.
   */
  callsite?: boolean;
  /**
   * The title of the logger.  Prepended to all logs.
   * @default ''
   */
  title?: string;
  /**
   * The {@link LogLevel} of the logger: `trace` | `debug` | `info` | `warn` | `error` | `fatal` | `off`
   * @default 'info'
   */
  logLevel?: LogLevel;
}
declare const LOG_LEVELS: readonly ["trace", "debug", "info", "warn", "error", "off"];
type LogLevel = (typeof LOG_LEVELS)[number];
declare class Logger {
  #private;
  static LOG_LEVEL: LogLevel | undefined;
  private static _BYPASS_STYLES;
  private static _BYPASS_DEFER;
  title: string;
  options: LoggerOptions;
  logLevel: LogLevel;
  color: (str: string) => string;
  constructor(title: string, options?: LoggerOptions);
  constructor(options: LoggerOptions);
  get deferred(): boolean | undefined;
  /**
   * Logs any args as well as any logs in the current buffer.
   * @param args
   */
  log: (...args: any[]) => void;
  /**
   * Logs any args as well as any logs in the current buffer.
   * @param args
   */
  flush: (...args: any[]) => void;
  trace(...args: any[]): this;
  debug(...args: any[]): this;
  i: string;
  info(...args: any[]): this;
  warn(...args: any[]): this;
  error(...args: any[]): this;
  fatal(...args: any[]): this;
  group(label?: string): this;
  groupCollapsed(label?: string): this;
  groupEnd(): this;
  buffer: any[];
  /**
   * Replaces any sequentially repeating strings in the buffer with a single instance and a count.
   */
  consolidateBuffer(): void;
  /**
   * Used to display the name of a method being called and the arguments it's being called with.
   * @param str The name of the method being called.
   * @param args The arguments being passed to the method.
   * @returns The logger instance.
   *
   * @example
   * ```typescript
   * const log = new Logger('Foo')
   * const bar = (a: number) => log.fn('bar', a)
   * bar(1) // logs:
   * ⓘ Foo bar(1)
   * ```
   */
  fn(str: string, ...args: any[]): this;
  static createLogger(title: string, options?: LoggerOptions): (...args: any[]) => void;
}
declare const logger: (title?: string, options?: LoggerOptions) => (...args: any[]) => void;
//#endregion
export { LogLevel, Logger, LoggerOptions, logger };
//# sourceMappingURL=logger.d.ts.map