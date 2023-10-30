import { NextFunction, Request, Response } from 'express'
import Log, { ILog, LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import httpError from 'http-errors'
import { logger } from 'src/utils/logger'
import { logDeleteSchema } from 'src/utils/validationSchema'

export async function getAllLog(req: Request, res: Response, next: NextFunction) {
  try {
    const apiFeature = new APIFeature(Log.find().populate('user'), req.query).search().filter()
    let logs: ILog[] = await apiFeature.query
    const filteredCount = logs.length
    apiFeature.sorting().pagination()
    logs = await apiFeature.query.clone()

    res.status(200).json({ logs, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export async function getLogDetail(req:Request,res:Response,next:NextFunction) {
  try {
    const logExist = await Log.findOne({_id:req.params.id})
    if(!logExist) {
      throw httpError.NotFound()
    }
    res.status(200).json({log: logExist})
  } catch (error:any) {
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
