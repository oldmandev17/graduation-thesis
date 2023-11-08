import { Router } from 'express'
import {
  createService,
  deleteServices,
  getAllService,
  getServiceDetail,
  updateService,
  updateServiceStatus
} from 'src/controllers/serviceController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'
import { upload } from 'src/utils/upload'

const serviceRoutes = Router()

serviceRoutes
  .route('/create')
  .post(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('service').single('image'),
    createService
  )
serviceRoutes
  .route('/update/:id')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('service').single('image'),
    updateService
  )
serviceRoutes
  .route('/update')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), updateServiceStatus)
serviceRoutes.route('/').delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteServices)
serviceRoutes.route('/').get(getAllService)
serviceRoutes.route('/:id').get(getServiceDetail)
serviceRoutes.route('/:slug').get(getServiceDetail)

export default serviceRoutes
