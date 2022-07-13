import bcrypt from "bcrypt";
import { BCryptAdapter } from "../../../src/infra/crypto/BCryptAdapter";

type SutTypes = {
  sut: BCryptAdapter;
};
const makeSut = (salt: number): SutTypes => {
  const sut = new BCryptAdapter(salt);
  return { sut };
};

describe("BCryptAdapter", () => {
  describe("hash", () => {
    test("Should call bcrypt.hash with correct value", async () => {
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
    test("Should throw if bcrypt.hash throws", async () => {
      const salt = 10;
      const { sut } = makeSut(salt);
      jest
        .spyOn(bcrypt, "hash")
        .mockImplementationOnce(async () => Promise.reject(new Error()));
      const promise = sut.hash("any_value");
      expect(promise).rejects.toThrow();
    });
  });
  describe("compare", () => {
    test("Should call bcrypt.compare with correct values", async () => {
      const salt = 10;
      const { sut } = makeSut(salt);
      const comapreSpy = jest.spyOn(bcrypt, "compare");
      await sut.compare("any_value", "other_value");
      expect(comapreSpy).toHaveBeenCalledWith("any_value", "other_value");
    });
    test("Should throw if bcrypt.compare throws", async () => {
      const salt = 10;
      const { sut } = makeSut(salt);
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementationOnce(async () => Promise.reject(new Error()));
      const promise = sut.compare("any_value", "any_value");
      expect(promise).rejects.toThrow();
    });
    test("Should return false if bcrypt.comparereturn false", async () => {
      const salt = 10;
      const { sut } = makeSut(salt);
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementationOnce(async () => Promise.resolve(false));
      const isEqual = await sut.compare("any_value", "any_value");
      expect(isEqual).toBeFalsy();
    });
    test("Should return true if bcrypt.compare return true", async () => {
      const salt = 10;
      const { sut } = makeSut(salt);
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementationOnce(async () => Promise.resolve(true));
      const isEqual = await sut.compare("any_value", "any_value");
      expect(isEqual).toBeTruthy();
    });
  });
});
