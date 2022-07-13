import jwt from "jsonwebtoken";
import { JWTAdapter } from "../../../src/infra/crypto/JWTAdapter";

const secretJWT = "any_secret";
const makeSut = () => {
  const sut = new JWTAdapter(secretJWT);
  return { sut };
};
describe("JWTAdapter", () => {
  test("Should call sign with correct values", async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_value");
    expect(signSpy).toHaveBeenCalledWith("any_value", secretJWT);
  });
  test("Should throw if sign throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.encrypt("any_value");
    expect(response).rejects.toThrow();
  });
  test("Should return a jwt on success", async () => {
    const { sut } = makeSut();
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => "any_jwt");
    const jwtToken = await sut.encrypt("any_value");
    expect(jwtToken).toBe("any_jwt");
  });
});
