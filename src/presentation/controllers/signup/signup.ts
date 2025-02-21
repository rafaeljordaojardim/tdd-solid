import { AddAccount, EmailValidator, Validation } from "./signup-protocols";
import { InvalidParamError, MissingParamError } from "../../erros/";
import { badRequest, serverError, ok } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller"
import { httpRequest, httpResponse } from "../../protocols/http"

export class SignUpController implements Controller{

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {

  }
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {name,email, password, passwordConfirmation} = httpRequest.body;
      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({name, email, password})

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}