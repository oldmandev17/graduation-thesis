/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-named-default
import { default as jwt_decode } from 'jwt-decode'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function RequiredAuth({ allowPermissions = [] }: { allowPermissions: Array<string> }) {
  const { user } = useAppSelector((state) => state.auth)
  const { accessToken } = getToken()
  const location = useLocation()
  if (!accessToken) return <Navigate to='/auth/login' state={{ from: location }} replace />
  const decode: { userId: string; role: Array<string> } = jwt_decode(accessToken)
  const userPermissions: Array<string> = decode?.role || []
  // eslint-disable-next-line no-nested-ternary
  return userPermissions.find((p) => allowPermissions?.includes(p)) || allowPermissions.length <= 0 ? (
    <Outlet />
  ) : user && user._id ? (
    <Navigate to='/auth/unAuthorize' state={{ from: location }} replace />
  ) : (
    <Navigate to='/auth/login' state={{ from: location }} replace />
  )
}

export default RequiredAuth
