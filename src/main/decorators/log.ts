import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { Controller, httpRequest, httpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor(private readonly contoller: Controller, private readonly logErrorRepository: LogErrorRepository) {

  }
  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    const httpResponse = await this.contoller.handle(httpRequest)
    if (httpResponse.statusCode == 500) {
      await this.logErrorRepository.log(httpRequest.body.stack)
    }
    return httpResponse

  }

}