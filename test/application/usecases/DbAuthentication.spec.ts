import { DbAuthentication } from "../../../src/application/usecases/DbAuthentication";
import { AccountModel } from "../../../src/domain/models/Account";
const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});
const makeFakeInput = () => ({
  email: "any_email@email.com",
  password: "any_password",
});
const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepository {
    async getAccountByEmail(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepository();
};

const makeSut = () => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAuthentication", () => {
  test("Shoul call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const getAccountByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      "getAccountByEmail"
    );
    const input = makeFakeInput();
    await sut.auth(input);
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(input.email);
  });
  test("Shoul return null if LoadAccountByEmailRepository no account found", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "getAccountByEmail")
      .mockImplementationOnce(async () => null as unknown as AccountModel);
    const input = makeFakeInput();
    const response = await sut.auth(input);
    expect(response).toBeFalsy();
  });
  test("Shoul throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "getAccountByEmail")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const promise = sut.auth(makeFakeInput());
    expect(promise).rejects.toThrow();
  });
});
