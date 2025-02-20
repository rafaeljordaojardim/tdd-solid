import { MissingParamError } from "../../erros";
import { badRequest } from "../../helpers/http-helper";
import { Controller, httpRequest, httpResponse } from "../../protocols";

export class LoginController implements Controller{
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    const fields = ['email', 'password']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }

}