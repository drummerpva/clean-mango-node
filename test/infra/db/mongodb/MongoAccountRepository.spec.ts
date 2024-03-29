import { Collection } from "mongodb";
import { MongoHelper } from "../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { MongoAccountRepository } from "../../../../src/infra/db/mongodb/MongoAccountRepository";

const makeSut = () => {
  const sut = new MongoAccountRepository();
  return {
    sut,
  };
};
describe("MongoAccountRepository", () => {
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
  test("Should return an Account on add success", async () => {
    const { sut } = makeSut();
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
  test("Should return an Account on getAccountByEmail success", async () => {
    const { sut } = makeSut();
    await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    const account = await sut.getAccountByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });
  test("Should return an Account on updateTokenById success", async () => {
    const { sut } = makeSut();
    const { insertedId } = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    await sut.updateTokenById(insertedId.toString(), "any_token");
    const account = await accountCollection.findOne({
      _id: insertedId,
    });
    expect(account?.accessToken).toBe("any_token");
  });
});
