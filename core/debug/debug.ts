import { Injectable, Context } from '../modularization';
import createDebug from 'debug';
import { yellow, magenta, red, blue } from 'colors';


@Injectable()
export class Debug {
  private readonly scope: string;
  private readonly addToLog: Function;

  constructor(private context: Context) {
    this.scope = context.moduleName + ':' + context.name;
    this.addToLog = createDebug(this.scope);
  }

  /**
   * Display a default log.
   */
  log(...args) {
    const message = args.shift();
    this.addToLog('[LOG] ' + message, ...args);
  }

  /**
   * Display a info message in blue.
   */
  info(...args) {
    const message = args.shift();
    this.addToLog(blue('[INFO] ') + message, ...args);
  }

  /**
   * Display a error message in red.
   */
  error(...args) {
    const message = args.shift();
    this.addToLog(red('[ERROR] ') + message, ...args);
  }

  /**
   * Display a debug message in magenta.
   */
  debug(...args) {
    const message = args.shift();
    this.addToLog(magenta('[DEBUG] ') + message, ...args);
  }

  /**
   * Display a warn message in yellow.
   */
  warn(...args) {
    const message = args.shift();
    this.addToLog(yellow('[WARN] ') + message, ...args);
  }
}
