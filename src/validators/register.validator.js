const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .regex(/^[A-zÀ-ú ]{2,60}$/)
    .uppercase()
    .required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().min(4).required(),
});

module.exports = registerSchema;
