import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";


export const makeSingupController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypt = new BcryptAdapter(12)
  const dbAddAccount = new DbAddAccount(bcrypt, accountMongoRepository)
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}