const ApiResponse = require('../utils/apiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return ApiResponse.error(
        res,
        'Validasi gagal, mohon periksa kembali input Anda',
        400,
        errorDetails
      );
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
