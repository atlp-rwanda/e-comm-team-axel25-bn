import Cart from "../database/models/Cart.model";
import Order from "../database/models/Order.model";
import Product from "../database/models/Product.model";
import { Orderinterface } from "../interfaces";

// To create order
export const createOrderService = async (
  userId: string,
  items: Orderinterface[],
) => {
  const order = await Order.create({
    userId,
    items: items,
  });
  return order;
};

export const getOrdersByUserService = async (userId: string) => {
  const orders = await Order.findAll({
    where: {
      userId,
    },
  });
  return orders;
};

// clear the orders
export const clearOrdersService = async (userId: string) => {
  const clearOrder = await Order.destroy({
    where: {
      userId,
    },
  });
  return clearOrder;
};

export const getOrderStatusService = async (
  userId: string,
  orderId: string,
): Promise<{ currentStatus: string; expectedDeliveryDate: Date }> => {
  const orders = await Order.findAll({
    where: {
      userId,
    },
  });
  const order = orders.find((ava) => ava.dataValues.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  const orderStatus = {
    currentStatus: order.dataValues.status,
    expectedDeliveryDate: order.dataValues.expectedDeliveryDate,
  };
  return orderStatus;
};

// PUT request to update order status information
export const updatedOrderStatusService = async (
  orderId: string,
  status: string,
): Promise<{ currentStatus: string; expectedDeliveryDate: Date }> => {
  const order = await Order.findOne({
    where: {
      id: orderId,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  const updatedOrder = await order.update({
    status,
  });
  const updatedOrderSt = {
    currentStatus: updatedOrder.dataValues.status,
    expectedDeliveryDate: updatedOrder.dataValues.expectedDeliveryDate,
  };
  return updatedOrderSt;
};

export const getCartItemsService = async (userId: string) => {
  const cartItems = await Cart.findAll({
    include: Product,
    where: {
      userId,
    },
  });
  const items = cartItems.map((item) => ({
    QUANTITY: item.dataValues.quantity,
    PRODUCT: item.dataValues.Product,
  }));
  return items;
};

export const getAllOrder = async () => {
  const orders = await Order.findAll();
  return orders;
};
