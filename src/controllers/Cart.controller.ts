import { Request, Response } from "express";
import {
  addToCartService,
  clearCartService,
  deleteCartItemService,
  findCartProductService,
  findProductService,
  isItemInCartService,
  updateCartService,
  viewCartService,
} from "../services";
import { calculateCartTotal, isValidUuid } from "../utils";
import { CartAttributes } from "../interfaces";

// add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const cartItem = req.body as CartAttributes;
    // first check if the productId is a valid uuid
    if (!isValidUuid(cartItem.productId)) {
      res.status(400).json({
        message: "Invalid product id",
        status: 400,
        success: false,
      });
    } else {
      // else if it is a valid uuid, proceed to add to cart
      const userId = req.user.id as string;
      // first find if the product exists
      const existingItem = await findProductService(cartItem.productId);
      if (!existingItem) {
        res.status(404).json({
          message: "Product not found",
          status: 404,
          success: false,
        });
      } else {
        // if it does exist, proceed to add to cart
        // first check if the quantity is greater than the stock, and return error
        if (cartItem.quantity > existingItem.dataValues.quantity) {
          res.status(400).json({
            message: "Quantity exceeds stock",
            status: 400,
            success: false,
          });
        } else {
          // first check if item is already in cart
          const alreadyInCart = await isItemInCartService(
            userId,
            cartItem.productId,
          );
          // if not, add to cart
          if (!alreadyInCart) {
            const addedCartItem = await addToCartService({
              ...cartItem,
              userId,
            });
            res.status(201).json({
              data: addedCartItem,
              message: "Item added to cart",
              status: 201,
              success: true,
            });
          } else {
            // else if it is already in the cart, tell the user that it is already in the cart
            res.status(400).json({
              message: "Item already in cart",
              status: 400,
              success: false,
            });
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error adding item to cart",
        error: error.message,
      });
    }
  }
};

// view items in cart
export const viewCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as string;

    const itemsInCart = await viewCartService(userId);
    const cartTotal = await calculateCartTotal(itemsInCart);
    res.status(200).send({
      data: { total: cartTotal, items: itemsInCart },
      status: 200,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error viewing items in cart",
        error: error.message,
      });
    }
  }
};

// remove an item from the cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const cartItemId = req.params.id;
    const removedItem = await deleteCartItemService(cartItemId);
    if (removedItem === 0) {
      res.status(404).json({
        message: "Item not found in cart",
        status: 404,
        success: false,
      });
    } else {
      res.status(200).send({
        data: removedItem,
        message: "Item removed from cart",
        status: 200,
        success: true,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
        message: "Error removing item from cart",
        status: 500,
        success: false,
      });
    }
  }
};

// clear the cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const clearedCart = await clearCartService(userId);

    res.status(201).send({
      data: clearedCart,
      message: "Cart cleared successfully!",
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
        message: "Error clearing items in cart",
        status: 500,
        success: false,
      });
    }
  }
};

// Buyer update a cart
export const updateCartProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const cartProductToUpdate = await findCartProductService(productId, userId);
    const parsedCartProductToUpdate = JSON.parse(
      JSON.stringify(cartProductToUpdate),
    );

    for (const productCriteria in req.body) {
      parsedCartProductToUpdate[productCriteria] = req.body[productCriteria];
    }

    await updateCartService(productId, userId, parsedCartProductToUpdate);

    // Calculate new total
    const itemsInCart = await viewCartService(userId);
    const cartTotal = await calculateCartTotal(itemsInCart);

    return res.status(200).json({
      status: 200,
      success: true,
      data: {
        total: cartTotal,
        items: JSON.parse(JSON.stringify(itemsInCart)),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
        message: "Error clearing items in cart",
        status: 500,
        success: false,
      });
    }
  }
};
