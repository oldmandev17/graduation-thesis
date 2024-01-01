import httpError from 'http-errors'
import Log, { LogMethod, LogName, LogStatus } from 'src/models/logModel'

interface Logger {
  user?: string
  name: LogName
  method: LogMethod
  status: LogStatus
  url: string
  errorMessage?: string
  content: any
}

export const logger = async (logger: Logger) => {
  try {
    if (logger.user)
      await Log.create({
        user: logger.user,
        name: logger.name,
        method: logger.method,
        status: logger.status,
        url: logger.url,
        errorMessage: logger.errorMessage,
        content: logger.content
      })
    else
      await Log.create({
        name: logger.name,
        method: logger.method,
        status: logger.status,
        url: logger.url,
        errorMessage: logger.errorMessage,
        content: logger.content
      })
  } catch (error) {
    return httpError.InternalServerError('Internal server error.')
  }
}
