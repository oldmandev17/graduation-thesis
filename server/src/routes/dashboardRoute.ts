import { Router } from 'express'
import { adminAnalytics } from 'src/controllers/dashboardController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const dashboardRouter = Router()

dashboardRouter
  .route('/analytics/:timeInterval')
  .get(verifyAccessToken, authorizeRoles([UserRole.ADMIN]), adminAnalytics)

export default dashboardRouter
