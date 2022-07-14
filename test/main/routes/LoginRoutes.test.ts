import request from "supertest";
import { Collection } from "mongodb";
import { DbAddAccount } from "../../../src/application/usecases/DbAddAccount";
import { BCryptAdapter } from "../../../src/infra/crypto/BCryptAdapter";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import { MongoAccountRepository } from "../../../src/infra/db/mongodb/MongoAccountRepository";
import app from "../../../src/main/config/app";
describe("SignUpRoutes", () => {
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  describe("POST /signup", () => {
    test("Shoul return 200 on signup success", async () => {
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
  describe("POST /login", () => {
    test("Shoul return 200 on login success", async () => {
      const user = {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      };
      const hasher = new BCryptAdapter(12);
      const mongoRepository = new MongoAccountRepository();
      const addAccountUseCase = new DbAddAccount(hasher, mongoRepository);
      await addAccountUseCase.add(user);
      const { body } = await request(app)
        .post("/api/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);
      expect(body).toBeTruthy();
      expect(body.accessToken).toBeTruthy();
    });
    test("Shoul return 401 if unauthorized", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "invalid_email@mail.com",
          password: "invalid_password",
        })
        .expect(401);
    });
  });
});
