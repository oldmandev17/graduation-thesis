import { Router } from 'express'
import {
  createCategory,
  deleteCategories,
  getAllCategory,
  getCategoryDetail,
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
categoryRoutes
  .route('/')
  .delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteCategories)
categoryRoutes.route('/').get(getAllCategory)
categoryRoutes.route('/id/:id').get(getCategoryDetail)
categoryRoutes.route('/slug/:slug').get(getCategoryDetail)

export default categoryRoutes
