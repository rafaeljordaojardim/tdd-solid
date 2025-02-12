import { InvalidParamError } from "../erros/invalid-param-error"
import { MissingParamError } from "../erros/missing-param-error"
import { badRequest, serverError } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { EmailValidator } from "../protocols/email-validator"
import { httpRequest, httpResponse } from "../protocols/http"

export class SignUpController implements Controller{

  constructor(private readonly emailValidator: EmailValidator) {

  }
  handle(httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {email, password, passwordConfirmation} = httpRequest.body;
      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}