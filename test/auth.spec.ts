import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/database/models";

describe(" 🦺 🛂 AUTH UNIT", () => {
  afterAll(async () => {
    // await sequelize.truncate({ cascade: true }); // deletes all data from all tables
    await sequelize.close(); // closes the connection to the database
  });
  /*
   **********************************************
   * 🟩 confirm user registration *
   **********************************************
   */
  describe("GET /api/v1/auth/confirm/:confirmationCode", () => {
    // if the code is wrong
    it("should return 400 BAD REQUEST", async () => {
      const res = await request(app).get("/api/v1/auth/confirm/45");
      expect(res.status).toEqual(400);
    });

    // if the code is correct and user exists
    // it('should return 200 OK', async () => {
    //   const newUser = await request(app).post('/api/v1/user').send({
    //     surName: 'KANYOMBYA',
    //     givenName: 'Irindi Sindizi',
    //     email: 'kanyombya@gmail.com',
    //     password: 'Password!23',
    //   });
    //   const currentUserCode = newUser.body.data[0].confirmationCode;
    //   const res = await request(app).get(
    //     `/api/v1/auth/confirm/${currentUserCode}`
    //   );
    //   expect(res.status).toEqual(201);
    // });
  });
  /*
   **********************************************
   * 🛑 end confirm user registration *
   **********************************************
   */
  /*
   **********************************************
   * 🛑 end login user *
   **********************************************
   */
  describe("LOGIN", () => {
    // it("it login a user (status :200)", async () => {
    //   const res = await request(app).post("/api/v1/auth/login").send({
    //     email: "buyer@gmail.com",
    //     password: "Password@123",
    //   });
    //   expect(res.status).toEqual(200);
    //   expect(res.body.message).toEqual("Login successful ");
    // });
    it("if email is not available,it not login a user (status :401)", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "buye@gmail.com",
        password: "Password@123",
      });
      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual("🚨 Invalid credentials");
    });
    // it("if password not match, it not login a user (status :401)", async () => {
    //   const res = await request(app).post("/api/v1/auth/login").send({
    //     email: "buyer@gmail.com",
    //     password: "Passwor@123",
    //   });
    //   expect(res.status).toEqual(401);
    //   expect(res.body.message).toEqual("Password does not match with email");
    // });

    it("if user did not confirm password,it not login a user (status :401)", async () => {
      //signUp
      await request(app).post("/api/v1/user").send({
        surname: "KANYOMBYA",
        given_name: "Irindi Sindizi",
        email: "kanyombya2@gmail.com",
        password: "Password!23",
      });
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "kanyombya2@gmail.com",
        password: "Password!23",
      });
      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual(
        "Please first head over to your email and confirm your registration",
      );
    });
  });
});
