import { Collection } from "mongodb";
import { MongoHelper } from "../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { MongoLogRepository } from "../../../../src/infra/db/mongodb/MongoLogRepository";

const makeSut = (mongoLogCollection: Collection) => {
  const sut = new MongoLogRepository();
  return {
    sut,
  };
};
describe("MongoLogRepository", () => {
  let errorColletion: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });
  beforeEach(async () => {
    errorColletion = await MongoHelper.getCollection("errors");
    await errorColletion.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test("Should create an error log on success", async () => {
    const { sut } = makeSut(errorColletion);
    await sut.log("any_error");
    const count = await errorColletion.countDocuments();
    expect(count).toBe(1);
  });
});
