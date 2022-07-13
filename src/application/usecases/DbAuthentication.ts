import { Authentication } from "../../domain/usecases/Authentication";
import { HashComparer } from "../protocols/cryptography/HashComparer";
import { LoadAccountByEmailRepository } from "../protocols/repository/LoadAccountByEmailRepository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}
  async auth(input: Authentication.Input): Promise<string> {
    const { email, password } = input;
    const account = await this.loadAccountByEmailRepository.getAccountByEmail(
      email
    );
    if (!account) return null as unknown as string;
    const isPasswordEqual = await this.hashComparer.compare(
      password,
      account.password
    );
    if (!isPasswordEqual) return null as unknown as string;
    return null as unknown as string;
  }
}
