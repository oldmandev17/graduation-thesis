import { NextFunction, Request, Response } from 'express'
import Log, { ILog, LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import { logger } from 'src/utils/logger'
import { logDeleteSchema } from 'src/utils/validationSchema'

export async function getAllLog(req: Request, res: Response, next: NextFunction) {
  try {
    const apiFeature = new APIFeature(
      Log.find().populate({ path: 'user', select: '_id name email phone provider verify role status' }),
      req.query
    )
      .search()
      .filter()
    let logs: ILog[] = await apiFeature.query
    const filteredCount = logs.length
    apiFeature.sorting().pagination()
    logs = await apiFeature.query.clone()

    res.status(200).json({ logs, filteredCount })
  } catch (error: any) {
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
    res.sendStatus(204)
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
