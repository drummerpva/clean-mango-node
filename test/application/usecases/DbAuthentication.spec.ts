import { DbAuthentication } from "../../../src/application/usecases/DbAuthentication";
import { AccountModel } from "../../../src/domain/models/Account";
const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});
const makeLoadAccountByEmailRepositoryStub = () => {
  class LoadAccountByEmailRepository {
    async getAccountByEmail(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepository();
};

const makeSut = () => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepository);
  return {
    sut,
    loadAccountByEmailRepository,
  };
};

const makeFakeInput = () => ({
  email: "any_email@email.com",
  password: "any_password",
});

describe("DbAuthentication", () => {
  test("Shoul call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    const getAccountByEmailSpy = jest.spyOn(
      loadAccountByEmailRepository,
      "getAccountByEmail"
    );
    const input = makeFakeInput();
    await sut.auth(input);
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(input.email);
  });
  test("Shoul return null with no account found", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepository, "getAccountByEmail")
      .mockImplementationOnce(async () => null as unknown as AccountModel);
    const input = makeFakeInput();
    const response = await sut.auth(input);
    expect(response).toBeFalsy();
  });
});
