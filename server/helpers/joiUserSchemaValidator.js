import Joi from "@hapi/joi";

export const userRegister = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(3).required(),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
  role:Joi.string(),
});

export const userLogin = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(3).required(),
});
