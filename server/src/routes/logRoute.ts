import { Router } from 'express'
import { getAllLog } from 'src/controllers/logController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const logRoutes = Router()

logRoutes.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllLog)

export default logRoutes
