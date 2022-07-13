import request from "supertest";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../src/main/config/app";
describe("SignUpRoutes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
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
