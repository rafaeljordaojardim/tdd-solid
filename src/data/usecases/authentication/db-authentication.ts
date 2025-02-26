import { Authentication } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {

  constructor(private loadAccountByEmailRepository: LoadAccountByEmailRepository) {}
 async auth(email: string, password: string): Promise<string> {
    await this.loadAccountByEmailRepository.load(email)
    return null
  }

}