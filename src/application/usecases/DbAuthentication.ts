import { Authentication } from "../../domain/usecases/Authentication";
import { HashComparer } from "../protocols/cryptography/HashComparer";
import { TokenGenerator } from "../protocols/cryptography/TokenGenerator";
import { LoadAccountByEmailRepository } from "../protocols/repository/LoadAccountByEmailRepository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
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
    await this.tokenGenerator.generate(account.id);
    return null as unknown as string;
  }
}
