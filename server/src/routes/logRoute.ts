import { Router } from 'express'
import { deleteLogs, getAllLog, getLogDetail } from 'src/controllers/logController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const logRoutes = Router()

logRoutes.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllLog)
logRoutes.route('/:id').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getLogDetail)
logRoutes.route('/').delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteLogs)

export default logRoutes
