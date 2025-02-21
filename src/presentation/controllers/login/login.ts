import { InvalidParamError, MissingParamError } from "../../erros";
import { badRequest } from "../../helpers/http-helper";
import { Controller, httpRequest, httpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller{
  constructor(
    private readonly emailValidator: EmailValidator
  ) {}
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    const fields = ['email', 'password']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }

}