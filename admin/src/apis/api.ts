import { CategoryStatus } from 'modules/category'
import { LogMethod, LogName, LogStatus } from 'modules/log'
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

export {
  createCategory,
  deleteCategory,
  deleteLog,
  getAllCategory,
  getAllLog,
  getAllUser,
  getCategoryDetail,
  updateCategory,
  updateCategoryStatus
}
