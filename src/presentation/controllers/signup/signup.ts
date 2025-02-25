import { AddAccount, EmailValidator, Validation } from "./signup-protocols";
import { InvalidParamError } from "../../erros/";
import { badRequest, serverError, ok } from "../../helpers/http/http-helper"
import { Controller } from "../../protocols/controller"
import { httpRequest, httpResponse } from "../../protocols/http"

export class SignUpController implements Controller{

  constructor(
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
     
      const {name,email, password} = httpRequest.body;
      const account = await this.addAccount.add({name, email, password})

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}