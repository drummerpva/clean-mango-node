import { DbAddAccount } from "../../../src/application/usecases/DbAddAccount";
import {
  Hasher,
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
} from "../../../src/application/usecases/DbAddAccount-protocols";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
};
const makeAddAccountRepositoryrStub = () => {
  class AddAccountRepositoryStub {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new AddAccountRepositoryStub();
};
const makeHasherStub = () => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new HasherStub();
};
const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryrStub();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);
  return {
    hasherStub,
    sut,
    addAccountRepositoryStub,
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

describe("DbAddAccount UseCase", () => {
  test("Should call Hasher with correct value", async () => {
    const { hasherStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(makeFakeAccountData());
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
  test("Should throw if Hasher throws", async () => {
    const { hasherStub, sut } = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const promise = sut.add(makeFakeAccountData());
    expect(promise).rejects.toThrow();
  });
  test("Should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
  test("Should throw if Hasher throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error());
      });
    const promise = sut.add(makeFakeAccountData());
    expect(promise).rejects.toThrow();
  });
  test("Should return and Account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
