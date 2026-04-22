import configure from "../config/config.js";


const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default to 500 if no status code is provided
    const status = statusCode || 500;
    const errorMessage = message || "Internal Server Error";

    res.status(status).json({
        success: false,
        message: errorMessage,
        stack: configure.node_env === "development" ? err.stack : undefined,
    });
};

export default errorHandler;