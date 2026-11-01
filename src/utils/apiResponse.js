/**
 * Standardized API Response Helper
 */
class ApiResponse {
  /**
   * Send a successful response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any} data
   * @param {number} statusCode
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
    };
    if (data !== null && data !== undefined) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {number} statusCode
   * @param {any} errors
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors !== null && errors !== undefined) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
