// import errorHandler from "../middleware/error.middleware";

class HandleError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default HandleError;