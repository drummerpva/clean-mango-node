import jwt from "jsonwebtoken";
import { Encrypter } from "../../application/protocols/cryptography/Encrypter";

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  async encrypt(id: string): Promise<string> {
    jwt.sign(id, this.secret);
    return "";
  }
}
