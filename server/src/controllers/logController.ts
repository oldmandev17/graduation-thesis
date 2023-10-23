import { NextFunction, Request, Response } from 'express'
import Log, { ILog, LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import { logger } from 'src/utils/logger'
import { logDeleteSchema } from 'src/utils/validationSchema'

export async function getAllLog(req: Request, res: Response, next: NextFunction) {
  try {
    const apiFeature = new APIFeature(Log.find().populate('user'), req.query).search().filter()
    let logs: ILog[] = await apiFeature.query
    const filteredCount = logs.length
    apiFeature.sorting().pagination()
    logs = await apiFeature.query.clone()
    logger({
      user: req.payload.userId,
      name: LogName.GET_ALL_LOG,
      method: LogMethod.GET,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ logs, filteredCount })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.GET_ALL_LOG,
      method: LogMethod.GET,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    next(error)
  }
}

export async function deleteLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await logDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      await Log.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_LOGS,
      method: LogMethod.DELETE,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(204).send()
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_LOGS,
      method: LogMethod.DELETE,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    next(error)
  }
}
