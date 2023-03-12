import request from "supertest";
import app from "./../src/app";
import crypto from "node:crypto";
import { verifyToken } from "../src/utils";

let userJwt: string, adminJwt: string;

jest.mock("../src/services/mail/sendEmailToken", () => {
  return (...args: unknown[]) => {
    console.log(...args);
  };
});

describe("disabling user account tests", () => {
  const email = crypto.randomUUID() + "@gmail.com";
  const user = {
    email: email,
    password: "musliM123!",
    surname: "muslim",
    given_name: "uwi",
    role: "Seller",
  };

  const userCredintials = {
    email: email,
    password: "musliM123!",
  };
  const adminCredintials = {
    email: "admin@gmail.com",
    password: "Password@123",
  };

  beforeAll(async () => {
    const createUser = await request(app).post("/api/v1/user").send(user);
    const confirmationCode = createUser.body.data[0].confirmationCode;
    await request(app).get(`/api/v1/auth/confirm/${confirmationCode}`);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(userCredintials);
    const adminRes = await request(app)
      .post("/api/v1/auth/login")
      .send(adminCredintials);

    userJwt = res.body.data;
    adminJwt = adminRes.body.data;
  });

  it("admin should disable user account", async () => {
    const res = await request(app)
      .post("/api/v1/accounts/disable")
      .set("Authorization", "Bearer " + adminJwt)
      .send({
        userId: (await verifyToken(userJwt)).payload,
        reason: "selling mukorogo/(illegal)",
      });
    expect(res.status).toEqual(200);
  });

  it("user should not be able to use our service after account disabled", async () => {
    const res = await request(app)
      .post("/api/v1/auth/2fa") // any protected route is now disabled
      .set("Authorization", userJwt);

    expect(res.status).toEqual(401);
  });
});
