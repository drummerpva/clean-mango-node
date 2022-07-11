import bcrypt from "bcrypt";
import { Encrypter } from "../../application/protocols/Encrypter";

export class BCryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}
  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt);
    return "";
  }
}
