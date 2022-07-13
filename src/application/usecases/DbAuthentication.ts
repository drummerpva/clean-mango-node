import { Authentication } from "../../domain/usecases/Authentication";
import { HashComparer } from "../protocols/cryptography/HashComparer";
import { Encrypter } from "../protocols/cryptography/Encrypter";
import { LoadAccountByEmailRepository } from "../protocols/repository/LoadAccountByEmailRepository";
import { UpdateAccessTokenRepository } from "../protocols/repository/UpdateAccessTokenRepository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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
    const accessToken = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateTokenById(
      account.id,
      accessToken
    );
    return accessToken;
  }
}
