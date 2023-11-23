import { UserGender, UserProvider, UserRole, UserStatus } from 'modules/user'
import { axiosFormData, axiosJson } from './axios'

function getAllUser(
  page: number | null,
  limit: number | null,
  status: UserStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null,
  gender: UserGender | null,
  provider: UserProvider | null,
  verify: boolean | null,
  role: UserRole | null,
  accessToken: string | undefined
) {
  let url = `/user?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (gender) url += `&&gender=${gender}`
  if (provider) url += `&&provider=${provider}`
  if (verify) url += `&&verify=${verify}`
  if (role) url += `&&role=${role}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export { getAllUser }
