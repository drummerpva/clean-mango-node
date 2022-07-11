import request from "supertest";
import app from "../../../src/main/config/app";
describe("SignUpRoutes", () => {
  test("Shoul return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      })
      .expect(200);
  });
});
