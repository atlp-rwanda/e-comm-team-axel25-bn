import Cart from "../database/models/Cart.model";
import Product from "../database/models/Product.model";
import { CartAttributes } from "../interfaces";

export const addToCartService = async (cartItem: CartAttributes) => {
  const addToCartRequest = await Cart.create(cartItem);
  return addToCartRequest;
};

export const isItemInCartService = async (
  userId: string,
  productId: string,
) => {
  const isItemInCartRequest = await Cart.findOne({
    where: {
      productId,
      userId,
    },
  });
  return !!isItemInCartRequest;
};

export const updateCartItemQuantityService = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const updateCartItemQuantityRequest = await Cart.update(
    { quantity },
    {
      where: {
        productId,
        userId,
      },
    },
  );

  return updateCartItemQuantityRequest;
};

export const viewCartService = async (userId: string) => {
  const viewCartRequest = await Cart.findAll({
    include: Product,
    where: {
      userId,
    },
  });
  return viewCartRequest;
};

export const deleteCartItemService = async (cartItemId: string) => {
  const deleteCartItemRequest = await Cart.destroy({
    where: {
      id: cartItemId,
    },
  });
  return deleteCartItemRequest;
};

export const clearCartService = async (userId: string) => {
  const clearCartRequest = await Cart.destroy({
    where: {
      userId,
    },
  });
  return clearCartRequest;
};

export const findCartProductService = async (
  productId: string,
  userId: string,
) => {
  const cartProductToUpdate = await Cart.findOne({
    where: { userId, productId },
  });
  return cartProductToUpdate;
};

export const updateCartService = async (
  productId: string,
  userId: string,
  parsedDataToUpdate: CartAttributes,
) => {
  const updatedCartProduct = await Cart.update(parsedDataToUpdate, {
    where: { productId, userId },
    returning: true,
  });
  return updatedCartProduct;
};
