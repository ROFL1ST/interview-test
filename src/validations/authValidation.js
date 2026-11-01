const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'string.min': 'Nama minimal 2 karakter',
    'string.max': 'Nama maksimal 100 karakter',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'string.max': 'Password maksimal 128 karakter',
    'any.required': 'Password wajib diisi',
  }),
  gender: Joi.string()
    .trim()
    .valid('male', 'female', 'laki-laki', 'perempuan')
    .insensitive()
    .required()
    .messages({
      'string.empty': 'Jenis kelamin tidak boleh kosong',
      'any.only': 'Jenis kelamin harus salah satu dari: male, female, laki-laki, atau perempuan',
      'any.required': 'Jenis kelamin wajib diisi',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'any.required': 'Password wajib diisi',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
