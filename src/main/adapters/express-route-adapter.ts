import { Controller, httpRequest } from "../../presentation/protocols";

export const adaptRoute = (controller: Controller) => {
  return async (req, res) => {
    const httpRequest: httpRequest ={
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
