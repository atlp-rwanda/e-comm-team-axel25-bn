import request from "supertest";
import app from "./../src/app";
import crypto from "node:crypto";

let jwt: string;
const email = crypto.randomUUID() + "@gmail.com";

describe("get all public messages", () => {
  beforeAll(async () => {
    const user = {
      email: email,
      password: "musliM123!",
      surname: "muslim",
      given_name: "uwi",
    };

    const userCredintials = {
      email: email,
      password: "musliM123!",
    };
    const createUser = await request(app).post("/api/v1/user").send(user);
    const confirmationCode = createUser.body.data[0].confirmationCode;
    await request(app).get(`/api/v1/auth/confirm/${confirmationCode}`);
    const resp = await request(app)
      .post("/api/v1/auth/login")
      .send(userCredintials);
    jwt = resp.body.data;
  });

  it("should get all public chat", async () => {
    const res = await request(app)
      .get("/api/v1/chat")
      .set("Authorization", "Bearer " + jwt);

    expect(res.status).toEqual(200);

    expect(res.body).toHaveProperty("data");
  });

  it("should not get all public chat", async () => {
    const res = await request(app)
      .get("/api/v1/chat?df=s")
      .set("Authorization", "Bearer " + jwt);

    expect(res.status).toEqual(500);
  });
});
