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

const categoryRouter = Router()

categoryRouter
  .route('/create')
  .post(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('category').single('image'),
    createCategory
  )
categoryRouter
  .route('/update/:id')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    upload('category').single('image'),
    updateCategory
  )
categoryRouter
  .route('/update')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), updateCategoryStatus)
categoryRouter
  .route('/')
  .delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), deleteCategories)
categoryRouter.route('/').get(getAllCategory)
categoryRouter
  .route('/id/:id')
  .get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getCategoryDetail)
categoryRouter.route('/slug/:slug').get(getCategoryDetail)

export default categoryRouter
