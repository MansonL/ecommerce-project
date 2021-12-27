/**
 *
 * Error Api to define differents errors
 *
 */

export class ApiError {
    error: number;
    message: string;
    constructor(error: number, message: string) {
        this.error = error;
        this.message = message;
    }

    /**
     *
     * @param msg: message to send with the error code to the client
     * @returns: new Error {error: xxx, message: '...'}
     */
    static badRequest = (msg: string) => {
        return new ApiError(400, msg);
    };
    static notFound = (msg: string) => {
        return new ApiError(404, msg);
    };
}
