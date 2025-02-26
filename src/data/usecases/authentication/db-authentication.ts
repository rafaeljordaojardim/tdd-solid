import { Authentication } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {

  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
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
  }

}