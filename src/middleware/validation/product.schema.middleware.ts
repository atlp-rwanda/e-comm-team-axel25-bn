import Joi from "joi";
import { CartAttributes, ProductAttributes } from "../../interfaces";

export const ProductSchema = {
  product: {
    create: Joi.object<ProductAttributes>({
      name: Joi.string().required(),
      category: Joi.string().required(),
      description: Joi.string().required(),
      stock: Joi.string().required(),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
      images: Joi.string(),
    }),
    addToCart: Joi.object<CartAttributes>({
      productId: Joi.string().required(),
      quantity: Joi.number(),
    }),
    updateCart: Joi.object<CartAttributes>({
      quantity: Joi.number().required(),
    }),
  },
};
