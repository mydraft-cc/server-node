const { createLogger, format, transports, config } = require("winston");

//exception log filename
const exceptionlogfile = __dirname + "/../logs/exceptions.log";
const rejectionslogfile = __dirname + "/../logs/rejections.log";
const errorslogfile = __dirname + "/../logs/errors.log";
const debugslogfile = __dirname + "/../logs/debug.log";

/**
 * Levels winston
 * { 
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
}
 */
const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        // format.colorize(),
        format.timestamp(),
        format.json()
      ),
    }),
    new transports.File({
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
      filename: errorslogfile,
    }),
    new transports.File({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
      filename: debugslogfile,
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: exceptionlogfile })],
  rejectionHandlers: [new transports.File({ filename: rejectionslogfile })],
  //see winston documentation https://www.npmjs.com/package/winston#logging-levels
  exitOnError: false,
});
module.exports = logger;
