import { Encrypter } from "../../../src/application/protocols/Encrypter";
import { DbAddAccount } from "../../../src/application/usecases/DbAddAccount";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
};
const makeEncrypterStub = () => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return "hashd_password";
    }
  }
  return new EncrypterStub();
};
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    encrypterStub,
    sut,
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
});
