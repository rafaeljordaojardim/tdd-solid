import { Authentication } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-acces-token-repository";

export class DbAuthentication implements Authentication {

  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
 async auth(email: string, password: string): Promise<string> {
    const user = await this.loadAccountByEmailRepository.load(email)
    if (!user) {
      return null
    }
    const isValid = await this.hashComparer.compare(password, user.password)

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(user.id)
    await this.updateAccessTokenRepository.update(user.id, accessToken)
    return accessToken
  }

}