import { Controller, httpRequest, httpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor(private readonly contoller: Controller) {

  }
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    const httpResponse = await this.contoller.handle(httpRequest)
    if (httpResponse.statusCode == 500) {
      console.log(`Some logger`);
    }
    return httpResponse

  }

}