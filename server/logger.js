import pino from 'pino';
import pretty from 'pino-pretty'; // Import pino-pretty as a default import

const logger = pino({
  level: 'info', // Set the default log level
  prettifier: pretty, // Use pino-pretty as the prettifier
  prettyPrint: {
    colorize: true, // Add colors to the output
    translateTime: 'yyyy-mm-dd HH:MM:ss', // Format the timestamp
    ignore: 'pid,hostname', // Ignore these fields
    messageFormat: (log, messageKey) => {
      const { req, res, msg, level } = log;
      let msgOutput = `[${log.level}] ${log.time}`;
      if (req) {
        msgOutput += ` - ${req.method} ${req.url}`;
      }
      if (res) {
        msgOutput += ` - ${res.statusCode}`;
      }
      if (msg) {
        msgOutput += ` - ${msg}`;
      }
      return msgOutput;
    }
  }
});

export default logger;
