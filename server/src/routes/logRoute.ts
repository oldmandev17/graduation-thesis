import { Router } from 'express'
import { deleteLogs, getAllLog } from 'src/controllers/logController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const logRouter = Router()

logRouter.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllLog)
logRouter.route('/').delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteLogs)

export default logRouter
