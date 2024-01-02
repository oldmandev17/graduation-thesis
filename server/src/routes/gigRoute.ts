import { Router } from 'express'
import {
  createGig,
  deleteGigs,
  getAllGig,
  getAllGigByUser,
  getAllGigFilter,
  getAllLandingGigByUser,
  getGigDetail,
  updateGig,
  updateGigStatus
} from 'src/controllers/gigController'
import { createReview } from 'src/controllers/reviewController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'
import { upload } from 'src/utils/upload'

const gigRouter = Router()

gigRouter.route('/create').post(verifyAccessToken, authorizeRoles([UserRole.SELLER]), upload('gig').any(), createGig)
gigRouter
  .route('/update/:id')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]),
    upload('gig').any(),
    updateGig
  )
gigRouter
  .route('/update')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]), updateGigStatus)
gigRouter
  .route('/')
  .delete(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]), deleteGigs)
gigRouter.route('/').get(getAllGig)
gigRouter.route('/filter').get(getAllGigFilter)
gigRouter.route('/user').get(verifyAccessToken, authorizeRoles([UserRole.SELLER, UserRole.BUYER]), getAllGigByUser)
gigRouter
  .route('/landing')
  .get(verifyAccessToken, authorizeRoles([UserRole.SELLER, UserRole.BUYER]), getAllLandingGigByUser)
gigRouter
  .route('/id/:id')
  .get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER]), getGigDetail)
gigRouter.route('/slug/:slug').get(getGigDetail)
gigRouter.route('/review/:id/create').post(verifyAccessToken, authorizeRoles([UserRole.BUYER]), createReview)

export default gigRouter
