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
});
