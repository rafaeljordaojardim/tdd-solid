import { MissingParamError } from "../../erros";
import { badRequest } from "../../helpers/http-helper";
import { Controller, httpRequest, httpResponse } from "../../protocols";

export class LoginController implements Controller{
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }
  }

}