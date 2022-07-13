import bcrypt from "bcrypt";
import { Hasher } from "../../application/protocols/cryptography/Hasher";

export class BCryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}
  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);
    return hashedValue;
  }
}
