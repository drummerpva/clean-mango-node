import { MongoClient } from "mongodb";
import { MongoHelper } from "../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { MongoAccountRepository } from "../../../../src/infra/db/mongodb/MongoAccountRepository";

const makeSut = (mongoClient: MongoClient) => {
  const sut = new MongoAccountRepository(mongoClient);
  return {
    sut,
  };
};
describe("MongoAccountRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test("Should return and Account on success", async () => {
    const { sut } = makeSut(MongoHelper.client);
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });
});
