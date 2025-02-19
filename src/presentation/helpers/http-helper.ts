import { ServerError } from "../erros/server-error"
import { httpResponse } from "../protocols/http"

export const badRequest = (error: Error): httpResponse => ({
    statusCode: 400,
    body: error
})

export const ok = (body?: any): httpResponse => ({
    statusCode: 200,
    body
})

export const serverError = (error: Error): httpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack)
})