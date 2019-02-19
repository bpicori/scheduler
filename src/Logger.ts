/**
 * Created by bpicori on 19-02-18
 */

import * as winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
export default logger;
