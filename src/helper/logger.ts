import winston from "winston";

// Create a logger instance
const logger = winston.createLogger({
    level: "info", // Log level
    format: winston.format.json(), // Log format
    transports: [
        new winston.transports.Console(), // Output logs to console
        new winston.transports.File({ filename: "logs/crm-service.log" }), // Output logs to a file
    ],
});


export default logger