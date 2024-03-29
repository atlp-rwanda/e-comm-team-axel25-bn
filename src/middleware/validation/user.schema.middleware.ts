import Joi from "joi";
import { UserAttributes } from "../../interfaces";

const passwordSchema = Joi.string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password should be at least 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  });
export const UserSchema = {
  user: {
    create: Joi.object<UserAttributes>({
      surname: Joi.string().required(),
      given_name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: passwordSchema,
      province: Joi.string(),
      district: Joi.string(),
      sector: Joi.string(),
      cell: Joi.string(),
      street: Joi.string(),
      role: Joi.string(),
    }),
  },

  loginData: {
    create: Joi.object<UserAttributes>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  passwordUpdate: {
    create: Joi.object({
      currentPassword: passwordSchema,
      newPassword: passwordSchema,
      newPasswordConfirmation: passwordSchema,
    }),
  },
  updateUser: {
    create: Joi.object<UserAttributes>({
      surname: Joi.string(),
      given_name: Joi.string(),
      province: Joi.string(),
      district: Joi.string(),
      sector: Joi.string(),
      cell: Joi.string(),
      street: Joi.string(),
      avatar: Joi.string(),
    }),
  },
};
