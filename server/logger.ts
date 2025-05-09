import chalk from "chalk";
import BaseContext from "./context/BaseContext";

type OutColor =
	| "red"
	| "green"
	| "blue"
	| "yellow"
	| "magenta"
	| "cyan"
	| "black"
	| "white"
	| "grey";

type OutType = "log" | "error" | "warn" | "info";

export class Logger extends BaseContext {
	public static log(...args: any[]) {
		Logger.out("log", "[LOG]", "green")(...args);
	}
	public static error(...args: any[]) {
		Logger.out("error", "[ERR]", "red")(...args);
	}
	public static warn(...args: any[]) {
		Logger.out("warn", "[WARN]", "yellow")(...args);
	}
	public static info(...args: any[]) {
		Logger.out("info", "[INFO]", "cyan")(...args);
	}

	public static out(
		type: OutType,
		label: string,
		labelColor: OutColor
	) {
		return (...args: any[]) => {
			console[type](
				chalk[labelColor](label),
				...args,
			);
		};
	}
	public log = Logger.log;
	public error = Logger.error;
	public warn = Logger.warn;
	public info = Logger.info;
	public out = Logger.out;

	// public log(...args: any[]) {
	// 	Logger.log(...args);
	// }
	// public error(...args: any[]) {
	// 	Logger.error(...args);
	// }
	// public warn(...args: any[]) {
	// 	Logger.warn(...args);
	// }
	// public info(...args: any[]) {
	// 	Logger.info(...args);
	// }

	// public out(
	// 	type: OutType,
	// 	label: string,
	// 	labelColor: OutColor
	// ) {
	// 	Logger.out(type, label, labelColor);
	// }
}
