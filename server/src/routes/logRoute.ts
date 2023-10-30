import { Router } from 'express'
import { deleteLogs, getAllLog } from 'src/controllers/logController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const logRoutes = Router()

logRoutes.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllLog)
logRoutes.route('/').delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteLogs)

export default logRoutes
