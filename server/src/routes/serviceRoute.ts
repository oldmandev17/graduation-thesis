import { Router } from 'express'
import { createService, getAllService, updateService, updateServiceStatus } from 'src/controllers/serviceController'
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
serviceRoutes.route('/').get(getAllService)

export default serviceRoutes
