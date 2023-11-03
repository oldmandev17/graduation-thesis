import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import Service, { IService, ServiceStatus } from 'src/models/serviceModel'
import APIFeature from 'src/utils/apiFeature'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { logger } from 'src/utils/logger'
import { serviceDeleteSchema, serviceSchema, serviceStatusSchema } from 'src/utils/validationSchema'

interface ServiceQuery {
  status?: ServiceStatus
  parent?: string
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await serviceSchema.validateAsync(req.body)
    const slug = await createUniqueSlug(Service, result.name)
    const { parent } = req.query as unknown as ServiceQuery
    const service = new Service({
      image: file.path,
      description: result.description,
      name: result.name,
      slug,
      level: 1,
      createdBy: req.payload.userId
    })

    if (parent) {
      const parentService = await Service.findOne({ _id: parent })
      if (!parentService) {
        throw httpError.NotFound()
      }
      const level = parentService.level + 1
      if (level > 3) {
        throw httpError.NotAcceptable()
      }
      service.level = level
      parentService.subServices.push(service)
      await parentService.save()
    }
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
    const result = await serviceSchema.validateAsync(req.body)
    const serviceExist = await Service.findOne({
      _id: req.params.id
    })
    if (!serviceExist) throw httpError.NotFound()
    else {
      if (existsSync(serviceExist?.image)) unlinkSync(serviceExist?.image)
    }
    const slug = await createUniqueSlug(Service, result.name)
    let service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      {
        image: file?.path,
        name: result.name,
        description: result.description,
        slug,
        level: 1,
        updatedAt: Date.now(),
        updatedBy: req.payload.userId
      },
      { new: true }
    )
    if (parent) {
      if (parent === req.params.id) {
        throw httpError.Conflict()
      }
      const currentParentService = await Service.findOne({ subServices: req.params.id })
      if (currentParentService) {
        currentParentService.subServices = currentParentService.subServices.filter(
          (service) => String(service._id) !== req.params.id
        )
        await currentParentService.save()
      }
      const newParentService = await Service.findOne({ _id: parent })
      if (newParentService) {
        newParentService.subServices.push(service?._id)
        await newParentService.save()
        service = await Service.findOneAndUpdate(
          { _id: req.params.id },
          {
            level: newParentService.level + 1,
            updatedAt: Date.now(),
            updatedBy: req.payload.userId
          },
          { new: true }
        )
      }
      const maxLevel = 3
      const updateServiceLevels = async (serviceId: string, currentLevel: number) => {
        const subService = await Service.findOne({ _id: serviceId })
        if (!subService) {
          return
        }

        if (currentLevel <= maxLevel) {
          await Service.updateOne(
            { _id: subService._id },
            {
              level: currentLevel,
              updatedAt: Date.now(),
              updatedBy: req.payload.userId
            }
          )

          subService.subServices.forEach(async (subService) => {
            await updateServiceLevels(subService._id, currentLevel + 1)
          })
        }
      }
      service?.subServices.forEach(async (subService) => {
        await updateServiceLevels(subService._id, (service?.level as number) + 1)
      })
    }
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_SERVICE,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json()
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
          updatedAt: Date.now(),
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
    const { parent, ...restQuery } = req.query as unknown as ServiceQuery

    const query = Service.find()
      .populate('createdBy')
      .populate('updatedBy')
      .populate({
        path: 'subServices',
        populate: { path: 'subServices', populate: { path: 'subServices' } }
      })
    if (parent) {
      query.where({
        _id: parent
      })
    }

    const apiFeature = new APIFeature(query, restQuery).search().filter()
    let services: IService[] = await apiFeature.query
    const filteredCount = services.length
    apiFeature.sorting().pagination()
    services = await apiFeature.query.clone()
    const arrParentService: { label: string; value: any }[] = []
    const arrService: { label: string; value: any }[] = []
    services.map((parentService: IService) => {
      arrParentService.push({
        label: parentService.name,
        value: parentService._id
      })
      parentService.subServices.map((service: IService) => {
        arrService.push({
          label: service.name,
          value: service._id
        })
      })
    })
    res.status(200).json({ services, filteredCount, arrParentService, arrService })
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
