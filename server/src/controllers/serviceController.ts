import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Service, { ServiceStatus, IService } from 'src/models/serviceModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import { logger } from 'src/utils/logger'
import { serviceSchema, serviceDeleteSchema, serviceStatusSchema } from 'src/utils/validationSchema'

interface ServiceQuery {
  status?: ServiceStatus
  parent?: string
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await serviceSchema.validateAsync(req.body)
    const { parent } = req.query as unknown as ServiceQuery
    let service =  Service({
      image: file.path,
      description: result.description,
      name: result.name,
      createdBy: req.payload.userId
    })

    let level = 1;

    if(parent) {
      const parentService = await Service.findOne({_id:parent})
      if (!parentService) {
        throw httpError.NotFound()
      }
      level = parentService.level + 1
      service.level = level
      parentService.subServices.add(service)
      await parentService.save()
      service = parentService.subcategories[parentService.subcategories.length - 1]
    }
    service.level = level
    await service.save()
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_SERVICE,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).json({ service })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_SERVICE,
      method: LogMethod.POST,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File
    const { parent } = req.query as unknown as ServiceQuery
    const serviceExist = await Service.findOne({
      _id: req.params.id
    })
    if (!serviceExist) throw httpError.NotFound()
    else {
      if (existsSync(serviceExist?.image)) unlinkSync(serviceExist?.image)
    }
    const result = await serviceSchema.validateAsync(req.body)
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      {
        image: file?.path,
        name: result.name,
        updatedAt: Date.now(),
        updatedBy: req.payload.userId
      },
      { new: true }
    )
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_SERVICE,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ service })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_SERVICE,
      method: LogMethod.PUT,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export const updateServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await serviceStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as ServiceQuery
    result.forEach(async (id: string) => {
      await Service.updateOne(
        { _id: id },
        {
          status,
          updatedAt: new Date(),
          updatedBy: req.payload.userId
        }
      )
    })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_SERVICE_STATUS,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.sendStatus(200)
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_SERVICE_STATUS,
      method: LogMethod.PUT,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export const getAllService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiFeature = new APIFeature(Service.find().populate('createdBy').populate('updatedBy'), req.query)
      .search()
      .filter()
    let services: IService[] = await apiFeature.query
    const filteredCount = services.length
    apiFeature.sorting().pagination()
    services = await apiFeature.query.clone()
    res.status(200).json({ services, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export async function deleteServices(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await serviceDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      await Service.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_SERVICES,
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
      name: LogName.DELETE_SERVICES,
      method: LogMethod.DELETE,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    next(error)
  }
}
