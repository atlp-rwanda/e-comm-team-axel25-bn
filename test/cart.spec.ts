import app from "../src/app";
import request from "supertest";

jest.setTimeout(3000000);

describe("🛒 📦 CART UNIT", () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    try {
      // login our buyer
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "buyer@gmail.com",
        password: "Password@123",
      });
      token = await loginResponse.body.data;
      //   get the product id of the first product in the database
      productId = "4b35a4b0-53e8-48a4-97b0-9d3685d3197c";
    } catch (error) {
      if (error instanceof Error) {
        console.log(`🍎 Error in the cart beforeAll hook ${error.message}`);
      } else {
        console.log(`🍎 Error in the cart beforeAll hook ${error}`);
      }
    }
  });
  /*
   **********************************************
   *  🟩 Add item to a cart *
   **********************************************
   */
  describe("POST /api/v1/cart/add", () => {
    // Buyer add item to cart if the item doesn't already exist in the cart
    it(`should return 201 if the item is added to the cart`, async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: productId,
        quantity: 2,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(201);
    });
    // return 404 if the product doesn't exist
    it(`should return 404 if the product doesn't exist`, async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: "d2c11523-0b55-42e5-8683-6cae46e73b53",
        quantity: 7,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(404);
    });

    // return 400 if the quantity is greater than the available quantity
    it(`should return 400 if the quantity is greater than the available quantity`, async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: productId,
        quantity: 1000,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(400);
    });

    // if the item already exists in the cart, return 400
    it("should return 400 if the item already exists in the cart", async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: productId,
        quantity: 3,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(400);
    });

    // return 400 if the productId is not a valid uuid
    it("should return 400 if the productId is not a valid uuid", async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: "invalid",
        quantity: 1,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(400);
    });
  });
  /*
   **********************************************
   * 🛑 end add item to cart *
   **********************************************
   */

  /*
   **********************************************
   *  🟩 View cart *
   **********************************************
   */

  describe("GET /api/v1/cart/", () => {
    it("should return 200 OK after displaying entire cart", async () => {
      //   view the current user's cart
      const res = await request(app)
        .get("/api/v1/cart/")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(200);
    });
  });
  /*
   **********************************************
   * 🛑 end view cart *
   **********************************************
   */

  /*
   **********************************************
   *  🟩 Clear cart *
   **********************************************
   */

  describe("DELETE /api/v1/cart/", () => {
    // remove one item from the cart
    it("should return 200 OK after removing one item from the cart", async () => {
      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: productId,
        quantity: 1,
      };
      // create a cart item
      await request(app)
        .post("/api/v1/cart/add")
        .send(cartItem)
        .set("Authorization", "Bearer " + token);
      // first get the entire cart
      const getCartResponse = await request(app)
        .get("/api/v1/cart/")
        .set("Authorization", "Bearer " + token);
      // get the cart item id
      const cartItemId = getCartResponse.body.data.items[0].id;
      //   remove the cart item from the cart
      const res = await request(app)
        .delete(`/api/v1/cart/remove/${cartItemId}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(200);
    });

    // return 404 if the cart item does not exist
    it("should return 404 if the cart item does not exist", async () => {
      //   remove the cart item from the cart
      const res = await request(app)
        .delete(`/api/v1/cart/0`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(404);
    });

    //   clear the current user's cart
    it("should return 200 OK after clearing entire cart", async () => {
      //   clear the current user's cart
      const res = await request(app)
        .delete("/api/v1/cart/clear")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(201);
    });
  });
  /*
   **********************************************
   * 🛑 end clear cart *
   **********************************************
   */
  /*
   **********************************************
   *  🟩 Buyer update cart *
   **********************************************
   */
  describe("PATCH /api/v1/cart/update/{productId}", () => {
    it("should return 200 if product in cart updated successfully", async () => {
      /**
       * I used this method of first adding item in cart because
       * the cart clearing test is run before updating the cart product test.
       */

      // prepare a cart item to send to the cart endpoint
      const cartItem = {
        productId: productId,
        quantity: 2,
      };

      //   send the cart item to the cart endpoint
      const res = await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
      expect(res.status).toEqual(201);

      // update product start here
      const resOfUpdate = await request(app)
        .patch(`/api/v1/cart/update/${productId}`)
        .set("Authorization", "Bearer " + token)
        .send({
          quantity: 55,
        });
      expect(resOfUpdate.status).toEqual(200);
    });
  });
  /*
   **********************************************
   * 🛑 End Of Buyer update cart *
   **********************************************
   */
});
