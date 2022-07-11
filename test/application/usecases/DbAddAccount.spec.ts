import { DbAddAccount } from "../../../src/application/usecases/DbAddAccount";
import {
  Encrypter,
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
} from "../../../src/application/usecases/DbAddAccount-protocols";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};
const makeAddAccountRepositoryrStub = () => {
  class AddAccountRepositoryStub {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return fakeAccount;
    }
  }
  return new AddAccountRepositoryStub();
};
const makeEncrypterStub = () => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new EncrypterStub();
};
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryrStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    encrypterStub,
    sut,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount UseCase", () => {
  test("Should call Encrypter with correct value", async () => {
    const { encrypterStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
  test("Should throw if Encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
  test("Should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_passwords",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
  test("Should throw if Encrypter throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error());
      });
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
  test("Should return and Account on success", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_passwords",
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});
