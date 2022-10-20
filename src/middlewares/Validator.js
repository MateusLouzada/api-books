const createHttpError = require("http-errors");
const Joi = require("joi");
const Validators = require("../validators");

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`"${validator}" validador não existe!`);
  }

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi)
        return next(res.status(422).send({ message: err.details[0].path }));
      next(createHttpError(500));
    }
  };
};
