import { CategoryStatus } from 'modules/category'
import { GigStatus } from 'modules/gig'
import { LogMethod, LogName, LogStatus } from 'modules/log'
import { OrderMethod, OrderStatus } from 'modules/order'
import { UserGender, UserProvider, UserRole, UserStatus } from 'modules/user'
import { axiosFormData, axiosJson } from './axios'

function getAllLog(
  page: number,
  limit: number,
  status: LogStatus | null,
  method: LogMethod | null,
  name: LogName | null,
  sortBy: string,
  orderBy: string,
  startDay: Date,
  endDay: Date,
  accessToken: string | undefined
) {
  let url = `/log?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (method) url += `&&method=${method}`
  if (name) url += `&&name=${name}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function deleteLog(arrIds: Array<string>, accessToken: string | undefined) {
  const url = '/log'
  return axiosJson.delete(url, {
    data: [...arrIds],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllCategory(
  page: number | null,
  limit: number | null,
  status: CategoryStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null,
  parent: string,
  level: number | undefined,
  accessToken: string | undefined
) {
  let url = `/category?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (parent) url += `&&parent=${parent}`
  if (level) url += `&&level=${level}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateCategoryStatus(arrIds: Array<string>, status: string, accessToken: string | undefined) {
  const url = `/category/update?status=${status}`
  return axiosJson.put(url, [...arrIds], {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function deleteCategory(arrIds: Array<string>, accessToken: string | undefined) {
  const url = '/category'
  return axiosJson.delete(url, {
    data: [...arrIds],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getCategoryDetail(id: string, accessToken: string | undefined) {
  const url = `/category/id/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

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
  verify: string | null,
  role: Array<UserRole> | null,
  accessToken: string | undefined
) {
  let url = `/auth/admin?sortBy=${sortBy}&&orderBy=${orderBy}`
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

function updateUserStatus(arrIds: Array<string>, status: string, accessToken: string | undefined) {
  const url = `/auth/admin/update-user?status=${status}`
  return axiosJson.put(url, [...arrIds], {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateUser(id: string, data: any, accessToken: string | undefined) {
  const url = `/auth/admin/update/${id}`
  return axiosJson.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateGigStatus(
  arrIds: Array<string>,
  status: string,
  reason: string | undefined,
  accessToken: string | undefined
) {
  const url = `/gig/update?status=${status}`
  return axiosJson.put(
    url,
    { ids: arrIds, reason },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

function createUser(data: any, accessToken: string | undefined) {
  const url = '/auth/admin/create-user'
  return axiosJson.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function sendMail(data: any, accessToken: string | undefined) {
  const url = '/auth/admin/send-email'
  return axiosJson.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getUserDetail(id: string | undefined, accessToken: string | undefined) {
  const url = `/auth/admin/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function createCategory(parent: string | null, data: any, accessToken: string | undefined) {
  let url = '/category/create'
  if (parent) url += `?parent=${parent}`
  return axiosFormData.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateCategory(id: string | undefined, parent: string | null, data: any, accessToken: string | undefined) {
  let url = `/category/update/${id}`
  if (parent) url += `?parent=${parent}`
  return axiosFormData.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllGig(
  page: number | null,
  limit: number | null,
  status: GigStatus | null,
  keyword: string,
  creator: string,
  categoryId: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null
) {
  let url = `/gig?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (creator) url += `&&creator=${creator}`
  if (categoryId) url += `&&categoryId=${categoryId}`
  return axiosJson.get(url)
}

function getAllOrder(
  page: number | null,
  limit: number | null,
  status: OrderStatus | null,
  method: OrderMethod | null,
  keyword: string,
  creator: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null,
  accessToken: string | undefined
) {
  let url = `/order?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (method) url += `&&method=${method}`
  if (keyword) url += `&&keyword=${keyword}`
  if (creator) url += `&&creator=${creator}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getGigDetailById(id: string | undefined, accessToken: string | undefined) {
  const url = `/gig/id/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllNotification(accessToken: string | undefined) {
  const url = '/auth/notification'
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function seenNotification(id: string, accessToken: string | undefined) {
  const url = `/auth/seen-notification/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export {
  createCategory,
  createUser,
  deleteCategory,
  deleteLog,
  getAllCategory,
  getAllGig,
  getAllLog,
  getAllOrder,
  getAllUser,
  getCategoryDetail,
  getUserDetail,
  sendMail,
  updateCategory,
  updateCategoryStatus,
  updateGigStatus,
  updateUserStatus,
  getGigDetailById,
  updateUser,
  getAllNotification,
  seenNotification
}
