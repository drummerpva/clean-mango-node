import bcrypt, { hash } from "bcrypt";
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
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
});
