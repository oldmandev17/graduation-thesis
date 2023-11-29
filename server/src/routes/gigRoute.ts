import { Router } from 'express'
import {
  createGig,
  createReview,
  deleteGigs,
  getAllGig,
  getGigDetail,
  updateGig,
  updateGigStatus
} from 'src/controllers/gigController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'
import { upload } from 'src/utils/upload'

const gigRoutes = Router()

gigRoutes.route('/create').post(verifyAccessToken, authorizeRoles([UserRole.SELLER]), upload('gig').any(), createGig)
gigRoutes
  .route('/update/:id')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]),
    upload('gig').any(),
    updateGig
  )
gigRoutes
  .route('/update')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]), updateGigStatus)
gigRoutes
  .route('/')
  .delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]), deleteGigs)
gigRoutes.route('/').get(getAllGig)
gigRoutes.route('/id/:id').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getGigDetail)
gigRoutes.route('/slug/:slug').get(getGigDetail)
gigRoutes.route('/:id/create-review').post(verifyAccessToken, authorizeRoles([UserRole.BUYER]), createReview)

export default gigRoutes
