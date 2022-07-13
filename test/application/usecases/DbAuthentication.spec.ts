import { HashComparer } from "../../../src/application/protocols/cryptography/HashComparer";
import { LoadAccountByEmailRepository } from "../../../src/application/protocols/repository/LoadAccountByEmailRepository";
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
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async getAccountByEmail(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
const makeHashComparer = () => {
  class HashComparerStub implements HashComparer {
    async compare(value: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};

const makeSut = () => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
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
    const accessToken = await sut.auth(input);
    expect(accessToken).toBeFalsy();
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
  test("Shoul call HashComparer with correct password", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    const input = makeFakeInput();
    await sut.auth(input);
    expect(compareSpy).toHaveBeenCalledWith(input.password);
  });
  test("Shoul throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockImplementationOnce(async () => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeInput());
    expect(promise).rejects.toThrow();
  });
  test("Shoul return null if HashCompare return false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockImplementationOnce(async () => false);
    const accessToken = await sut.auth(makeFakeInput());
    expect(accessToken).toBeFalsy();
  });
});
