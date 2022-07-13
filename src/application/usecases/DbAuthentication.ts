import { Authentication } from "../../domain/usecases/Authentication";
import { LoadAccountByEmailRepository } from "../protocols/repository/LoadAccountByEmailRepository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}
  async auth(input: Authentication.Input): Promise<string> {
    const { email } = input;
    const account = await this.loadAccountByEmailRepository.getAccountByEmail(
      email
    );
    if (!account) return null as unknown as string;
    return null as unknown as string;
  }
}
