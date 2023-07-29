import Joi from "joi";

export const insertCustomerSchema = Joi.object({
  name: Joi.string().trim().required().min(1),
  phone: Joi.string()
    .trim()
    .pattern(/^\d{10,11}$/)
    .required(),
  cpf: Joi.string().trim().length(11).pattern(/^\d+$/).required(),
  birthday: Joi.date().iso().required(),
});
