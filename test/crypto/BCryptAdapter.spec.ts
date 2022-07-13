import bcrypt from "bcrypt";
import { BCryptAdapter } from "../../src/infra/crypto/BCryptAdapter";

type SutTypes = {
  sut: BCryptAdapter;
};
const makeSut = (salt: number): SutTypes => {
  const sut = new BCryptAdapter(salt);
  return { sut };
};

describe("BCryptAdapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const salt = 10;
    const { sut } = makeSut(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return hashed value on success", async () => {
    const salt = 10;
    const { sut } = makeSut(salt);
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(async () => Promise.resolve("hashed_value"));
    const hashedValue = await sut.hash("any_value");
    expect(hashedValue).toBe("hashed_value");
  });
  test("Should throw if bcrypt throws", async () => {
    const salt = 10;
    const { sut } = makeSut(salt);
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(async () => Promise.reject(new Error()));
    const promise = sut.hash("any_value");
    expect(promise).rejects.toThrow();
  });
});
