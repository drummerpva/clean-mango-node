import bcrypt from "bcrypt";
import { HashComparer } from "../../application/protocols/cryptography/HashComparer";
import { Hasher } from "../../application/protocols/cryptography/Hasher";

export class BCryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}
  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);
    return hashedValue;
  }
  async compare(value: string, valueToCompare: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(value, valueToCompare);
    return isEqual;
  }
}
