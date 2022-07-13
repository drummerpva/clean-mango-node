import { HashComparer } from "../../../src/application/protocols/cryptography/HashComparer";
import { TokenGenerator } from "../../../src/application/protocols/cryptography/TokenGenerator";
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
    async compare(value: string, valueToCompare: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
const makeTokenGenerator = () => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return "token";
    }
  }
  return new TokenGeneratorStub();
};

const makeSut = () => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
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
  test("Shoul call HashComparer with correct values", async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositoryStub } =
      makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    const input = makeFakeInput();
    const account = await loadAccountByEmailRepositoryStub.getAccountByEmail(
      "any_email"
    );
    await sut.auth(input);
    expect(compareSpy).toHaveBeenCalledWith(input.password, account.password);
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
  test("Shoul call TokenGenerator with correct id", async () => {
    const { sut, loadAccountByEmailRepositoryStub, tokenGeneratorStub } =
      makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");
    const input = makeFakeInput();
    const account = await loadAccountByEmailRepositoryStub.getAccountByEmail(
      "any_email"
    );
    await sut.auth(input);
    expect(generateSpy).toHaveBeenCalledWith(account.id);
  });
  test("Shoul throw if TokenGenerator throw", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const input = makeFakeInput();
    const response = sut.auth(input);
    expect(response).rejects.toThrow();
  });
  test("Shoul return null if TokenGenerator not return", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockImplementationOnce(async () => null as unknown as string);
    const input = makeFakeInput();
    const accessToken = await sut.auth(input);
    expect(accessToken).toBeFalsy();
  });
});
