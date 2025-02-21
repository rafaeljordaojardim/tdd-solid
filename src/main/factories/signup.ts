import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { LogMongoRepository } from "../../infra/db/log-repository/log";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";
import { makeSignupValidation } from "./signup-validation";

export const makeSingupController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypt = new BcryptAdapter(12)
  const dbAddAccount = new DbAddAccount(bcrypt, accountMongoRepository)
  const validationComposite = makeSignupValidation()
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}