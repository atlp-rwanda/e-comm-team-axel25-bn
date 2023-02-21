import Cart from '../database/models/Cart.model';
import { CartAttributes } from '../interfaces';

// add to cart service
export const addToCartService = async (cartItem: CartAttributes) => {
  const addToCartRequest = await Cart.create(cartItem);
  return addToCartRequest;
};

// view cart service
export const viewCartService = async (userId: string) => {
  const viewCartRequest = await Cart.findAll({
    where: {
      userId,
    },
    // ! This failed because product is not associated to cart!
    // ? If you know a way to do this, please let me know!
    // * I tried to do this with a through table, but it didn't work
    // include: [
    //   {
    //     model: Product,
    //     as: 'name',
    //     through: {
    //       attributes: ['name', 'price', 'quantity'],
    //     },
    //   },
    // ],
  });
  return viewCartRequest;
};

// clear cart
export const clearCartService = async (userId: string) => {
  const clearCartRequest = await Cart.destroy({
    where: {
      userId,
    },
  });
  return clearCartRequest;
};
