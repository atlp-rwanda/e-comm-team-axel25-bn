import { Request, Response } from "express";
import { ProductAttributes } from "../interfaces";
import { isValidUuid } from "../utils/isValidUUID.util";
import {
  findOrCreateProductService,
  getAllItemsService,
  getAvailableProductsService,
  findOneProductService,
  destroyProductService,
  getOneAvailableProductService,
  findProductService,
  updateProductService,
} from "../services";
import { searchProductsUtility } from "../utils";
import { notifyReal } from "../controllers";

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const products = await searchProductsUtility(req.query);
    res.status(200).json({
      status: 200,
      success: true,
      message: `🍏 Found`,
      data: products,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.json({
        status: 500,
        success: false,
        message: `🍎 Something went wrong when searching for the product`,
        error: error.message,
      });
    } else console.log(`🍎 Something went wrong: `, error);
  }
};

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = req.body as ProductAttributes;
    const sellerId = req.user.id;
    // Check if Product already exist to avoid duplication
    const thisProductExists = await findOrCreateProductService({
      ...newProduct,
      sellerId,
    });
    if (thisProductExists[1] === false) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "This Product already exists, You can update the stock levels",
        data: thisProductExists,
      });
    } else {
      notifyReal({
        title: "Product creation",
        message: `Product "${newProduct.name}" has been created successfully`,
        email: req.user.email,
        action: "product create",
        userId: sellerId,
        message2: "A product that may interest you has been created",
        // "*/30 * * * * *",
      });
      return res
        .status(201)
        .json({ status: 201, success: true, data: thisProductExists });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong when creating the product",
        error: error.message,
      });
    } else {
      console.log("Unexpected error", error);
    }
  }
};

// Getting available products from the database
export const getAvailableProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await getAvailableProductsService();
    res.status(200).json({ status: 200, success: true, data: allProducts });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong when getting the products",
        error: error.message,
      });
    } else {
      console.log(`Unexpected error: ${error}`);
    }
  }
};
export const deleteOneItemFromproduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isValidUUID = isValidUuid(id);
    if (!isValidUUID) {
      return res.status(400).send({
        status: 400,
        message: "Invalid UUID format",
      });
    } else {
      const available = await findOneProductService(id);
      if (!available) {
        return res.status(400).send({
          status: 400,
          success: false,
          message: "Unavailable product",
        });
      } else {
        const productName = available.dataValues.name;
        const user = req.user;
        const sellerId = user.id;
        const userEmail = user.email;
        notifyReal({
          title: "Product Deletion",
          message: `Product "${productName}" has been deleted successfully`,
          email: userEmail,
          action: "product delete",
          userId: sellerId,
          // "*/30 * * * * *",
        });
        const clearProduct = await destroyProductService(id);
        res.status(201).send({
          status: 201,
          message: `Product deleted successfully`,
          data: clearProduct,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error while clearing product",
        error: error.message,
      });
    } else {
      console.log(`Unexpected error: ${error}`);
    }
  }
};

// Seller getting all items
export const getAllSellerItems = async (req: Request, res: Response) => {
  try {
    const allItems = await getAllItemsService();
    return res.status(200).json({
      status: 200,
      success: true,
      data: allItems,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong when getting the products",
        error: error.message,
      });
    } else {
      console.log(`Unexpected error: ${error}`);
    }
  }
};

// Getting One available product from the database
export const getOneAvailableProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const getThisProduct = await getOneAvailableProductService(productId);
    if (getThisProduct) {
      return res.status(200).json({
        status: 200,
        success: true,
        data: getThisProduct,
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "This Product does not exist",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong when fetching the product",
        error: error.message,
      });
    } else {
      console.log("Unexpected error", error);
    }
  }
};

// Seller update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const productToUpdate = await findProductService(productId);

    const parsedProductToUpdate = JSON.parse(JSON.stringify(productToUpdate));

    for (const productCriteria in req.body) {
      parsedProductToUpdate[productCriteria] = req.body[productCriteria];
    }

    const updatedProduct = await updateProductService(
      productId,
      parsedProductToUpdate,
    );
    notifyReal({
      title: "Product edit",
      message: `Product "${parsedProductToUpdate.name}" has been edited successfully`,
      email: req.user.email,
      action: "product edit",
      userId: req.user.id,
      // "*/30 * * * * *",
    });
    return res.status(200).json({
      status: 200,
      success: true,
      data: JSON.parse(JSON.stringify(updatedProduct))[1][0],
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong when getting the products",
        error: error.message,
      });
    }
  }
};
