import { HashComparer } from "../../../src/application/protocols/cryptography/HashComparer";
import { Encrypter } from "../../../src/application/protocols/cryptography/Encrypter";
import { LoadAccountByEmailRepository } from "../../../src/application/protocols/repository/LoadAccountByEmailRepository";
import { UpdateAccessTokenRepository } from "../../../src/application/protocols/repository/UpdateAccessTokenRepository";
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
const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateTokenById(id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub();
};
const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return "token";
    }
  }
  return new EncrypterStub();
};
const makeSut = () => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
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
  test("Shoul call Encrypter with correct id", async () => {
    const { sut, loadAccountByEmailRepositoryStub, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const input = makeFakeInput();
    const account = await loadAccountByEmailRepositoryStub.getAccountByEmail(
      "any_email"
    );
    await sut.auth(input);
    expect(encryptSpy).toHaveBeenCalledWith(account.id);
  });
  test("Shoul throw if Encrypter throw", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(async () => {
      throw new Error();
    });
    const input = makeFakeInput();
    const response = sut.auth(input);
    expect(response).rejects.toThrow();
  });
  test("Shoul return null if Encrypter not return", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockImplementationOnce(async () => null as unknown as string);
    const input = makeFakeInput();
    const accessToken = await sut.auth(input);
    expect(accessToken).toBeFalsy();
  });
  test("Shoul return an accessToken on success", async () => {
    const { sut } = makeSut();
    const input = makeFakeInput();
    const accessToken = await sut.auth(input);
    expect(accessToken).toBe("token");
  });
  test("Shoul call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateTokenById = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateTokenById"
    );
    const input = makeFakeInput();
    await sut.auth(input);
    expect(updateTokenById).toHaveBeenCalledWith("valid_id", "token");
  });
  test("Shoul throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateTokenById")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const input = makeFakeInput();
    const response = sut.auth(input);
    expect(response).rejects.toThrow();
  });
});
