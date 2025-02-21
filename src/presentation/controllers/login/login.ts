import { InvalidParamError, MissingParamError } from "../../erros";
import { badRequest, serverError, unauthorized } from "../../helpers/http-helper";
import { Controller, httpRequest, httpResponse, EmailValidator, Authentication } from "./login-protocols";

export class LoginController implements Controller{
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const fields = ['email', 'password']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email, password } = httpRequest.body
    const isValid = this.emailValidator.isValid(email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    const token = await this.authentication.auth(email, password)
    if (!token) {
      return unauthorized()
    }
    } catch (error) {
      return serverError(error)
    }
  }

}