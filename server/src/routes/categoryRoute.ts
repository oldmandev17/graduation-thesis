import { Router } from 'express'
import {
  createCategory,
  getAllCategory,
  updateCategory,
  updateCategoryStatus
} from 'src/controllers/categoryController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'
import { upload } from 'src/utils/upload'

const categoryRoutes = Router()

categoryRoutes
  .route('/create')
  .post(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('category').single('image'),
    createCategory
  )
categoryRoutes
  .route('/update/:id')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('category').single('image'),
    updateCategory
  )
categoryRoutes
  .route('/update')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), updateCategoryStatus)
categoryRoutes.route('/').get(getAllCategory)

export default categoryRoutes
