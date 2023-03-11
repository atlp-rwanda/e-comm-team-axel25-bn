// import request from "supertest";
// import app from "../src/app";
// import { sequelize } from "../src/database/models";
// import RolesPermission from "../src/database/models/Roles&Permission.model";

// jest.setTimeout(3000000);

// describe("Role and Permission UNIT", () => {
//   let token: string;
//   let adminToken: string;

//   beforeAll(async () => {
//     try {
//       // Initialize admin role and permissions
//       // await RolesPermission.create(AdminRoleAndPermission);

//       //login a buyer
//       const loginResponse = await request(app).post("/api/v1/auth/login").send({
//         email: "buyer@gmail.com",
//         password: "Password@123",
//       });

//       token = await loginResponse.body.data;
//       //login a admin
//       const loginBuyerResponse = await request(app)
//         .post("/api/v1/auth/login")
//         .send({
//           email: "admin@gmail.com",
//           password: "Password@123",
//         });
//       adminToken = await loginBuyerResponse.body.data;
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log(`🍎 Error logging in beforeAll hook ${error.message}`);
//       } else {
//         console.log(`🍎 Error logging in beforeAll hook`, error);
//       }
//     }
//   });

//   describe("POST /api/v1/role/set", () => {
//     it("should return 401 if no JWT in headers", async () => {
//       const res = await request(app)
//         .post("/api/v1/role/set")
//         .send({
//           role: "Admin",
//           permissions: [
//             "Set permissions",
//             "Add permissions",
//             "Rm permissions",
//             "Update role",
//           ],
//         });
//       console.log(JSON.parse(JSON.stringify(res)), "YYYYYYYYYYYYYYYYYY");
//       expect(res.status).toEqual(401);
//     });

//     it("should return 201 if an authorized token is povided", async () => {
//       const res = await request(app)
//         .post("/api/v1/role/set")
//         .set("Authorization", "Bearer " + adminToken)
//         .send({
//           role: "Buyer",
//           permissions: ["Add permissions", "Remove permissions", "Update role"],
//         });
//       expect(res.status).toEqual(201);
//     });

//     it("should return 403 if absent role provided", async () => {
//       const res = await request(app)
//         .post("/api/v1/role/set")
//         .set("Authorization", "Bearer " + token)
//         .send({
//           role: "Buyer",
//           permissions: ["Add permissions", "Remove permissions", "Update role"],
//         });
//       expect(res.status).toEqual(403);
//     });

//     it("should return 403 if un authorized access is done", async () => {
//       const res = await request(app)
//         .post("/api/v1/role/set")
//         .set("Authorization", "Bearer " + token) // buyer has no "Set permission" access.
//         .send({
//           role: "Seller",
//           permissions: ["Add permissions", "Remove permissions", "Update role"],
//         });
//       expect(res.status).toEqual(403);
//     });
//   });

// //   describe("DELETE /api/v1/role/remove/Buyer", () => {
// //     it("should return 200 if permission removed successfully", async () => {
// //       const res = await request(app)
// //         .delete("/api/v1/role/remove/Buyer")
// //         .set("Authorization", "Bearer " + adminToken)
// //         .send(["Request access"]);
// //       // expect(res.status).toEqual(200);
// //       console.log("The remove res :", JSON.parse(JSON.stringify(res)));
// //     });
// //   });

//   afterAll(async () => {
//     await RolesPermission.destroy({ where: { role: "Buyer" } });
//   });
// })
