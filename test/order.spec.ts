import request from "supertest";
import app from "../src/app";

describe("🚛 ✈️  ORDERS UNIT", () => {
  let token: string;
  let productId: string;
  let orderId: string;
  let Sellertoken: string;
  let Admintoken: string;

  beforeAll(async () => {
    try {
      // login our buyer
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "buyer@gmail.com",
        password: "Password@123",
      });
      token = await loginResponse.body.data;
      productId = "4b35a4b0-53e8-48a4-97b0-9d3685d3197c";
      const cartItem = {
        productId: productId,
        quantity: 2,
      };
      await request(app)
        .post("/api/v1/cart/add")
        .set("Authorization", "Bearer " + token)
        .send(cartItem);
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
   *  🟩 buyer create order from data in cart  *
   **********************************************
   */
  describe("POST /api/v1/order/", () => {
    // Buyer creates an order
    it("should return 201", async () => {
      // create the order
      const res = await request(app)
        .post("/api/v1/order/")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual("Order created");
    });
    it("should return 400 if no cart availabe", async () => {
      // create the order
      const currentUser = {
        email: "seller@gmail.com",
        password: "Password@123",
      };
      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send(currentUser);
      Sellertoken = loginResponse.body.data;
      const res = await request(app)
        .post("/api/v1/order/")
        .set("Authorization", "Bearer " + Sellertoken);
      expect(res.body.message).toEqual("No product available To make order");
      expect(res.status).toEqual(400);
    });
  });

  /*
   **********************************************
   *  🟩 buyer get all orders  *
   **********************************************
   */
  describe("get /api/v1/order/get/all", () => {
    it("should get all orders", async () => {
      const res = await request(app)
        .get("/api/v1/order/get/all")
        .set("Authorization", "Bearer " + token);
      orderId = res.body.data[0].id;
      expect(res.status).toEqual(200);
    });
  });

  /*
   **********************************************
   *  🟩 should get order status /api/v1/order/status/:orderId *
   **********************************************
   */
  describe("GET /api/v1/order/status/:orderId", () => {
    // Buyer gets order status
    it("should return 200", async () => {
      // get order status
      const res = await request(app)
        .get(`/api/v1/order/status/${orderId}`)
        .set("Authorization", "Bearer " + token);
      expect(res.body.data).toHaveProperty("currentStatus");
    });
    it("should return 404 if you try to get order status of invaliable order", async () => {
      // get order status
      const res = await request(app)
        .get(`/api/v1/order/status/14d080b4-4156-4905-81dc-530f11d499bb`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(404);
      expect(res.body.error).toEqual("Order not found");
    });
  });

  //   /*
  //    **********************************************
  //    *  🟩 admin should update order status /api/v1/order/status/:orderId *
  //    **********************************************
  //    */
  describe("PUT /api/v1/order/status/:orderId", () => {
    // Admin updates order status
    it("should return 200", async () => {
      // login the admin
      const currentUser = {
        email: "admin@gmail.com",
        password: "Password@123",
      };
      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send(currentUser);
      Admintoken = loginResponse.body.data;
      // update order status
      const updatedStatus = "Shipped";
      const res = await request(app)
        .put(`/api/v1/order/status/${orderId}`)
        .set("Authorization", "Bearer " + Admintoken)
        .send({ status: updatedStatus });
      expect(res.status).toEqual(200);
      expect(res.body.message).toEqual("status updated");
    });
    it("should return 403 if you are not admin", async () => {
      // login the admin

      // update order status
      const updatedStatus = "Shipped";
      const res = await request(app)
        .put(`/api/v1/order/status/${orderId}`)
        .set("Authorization", "Bearer " + Sellertoken)
        .send({ status: updatedStatus });
      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual(
        "Unauthorized access. You are not an admin",
      );
    });
  });
  /*
   **********************************************
   *  🟩 buyer delete orders  *
   **********************************************
   */
  describe("delete /api/v1/order/delete/all", () => {
    it("should delete all orders", async () => {
      const res = await request(app)
        .delete("/api/v1/order/delete/all")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual("All Orders canceled successfully!");
    });
  });
  describe("GET /api/v1/order/all", () => {
    // Admin get all order
    it("Admin should get all orders", async () => {
      const res = await request(app)
        .get("/api/v1/order/all")
        .set("Authorization", "Bearer " + Admintoken)
        .send();
      expect(res.status).toEqual(200);
    });

    it("Admin should return 403 when you are not admin", async () => {
      const res = await request(app)
        .get("/api/v1/order/all")
        .set("Authorization", "Bearer " + Sellertoken)
        .send();
      expect(res.status).toEqual(403);
    });
  });
});
