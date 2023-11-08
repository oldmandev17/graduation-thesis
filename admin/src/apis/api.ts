import { LogMethod, LogName, LogStatus } from 'modules/log'
import { ServiceStatus } from 'modules/service'
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

function getAllService(
  page: number | null,
  limit: number | null,
  status: ServiceStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null,
  parent: string,
  level: number | undefined,
  accessToken: string | undefined
) {
  let url = `/service?sortBy=${sortBy}&&orderBy=${orderBy}`
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

function updateServiceStatus(arrIds: Array<string>, status: string, accessToken: string | undefined) {
  const url = `/service/update?status=${status}`
  return axiosJson.put(url, [...arrIds], {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function deleteService(arrIds: Array<string>, accessToken: string | undefined) {
  const url = '/service'
  return axiosJson.delete(url, {
    data: [...arrIds],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getServiceDetail(id: string, accessToken: string | undefined) {
  const url = `/service/${id}`
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

function createService(parent: string | null, data: any, accessToken: string | undefined) {
  let url = '/service/create'
  if (parent) url += `?parent=${parent}`
  return axiosFormData.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateService(id: string | undefined, parent: string | null, data: any, accessToken: string | undefined) {
  let url = `/service/update/${id}`
  if (parent) url += `?parent=${parent}`
  return axiosFormData.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export {
  deleteLog,
  deleteService,
  getAllLog,
  getAllService,
  getAllUser,
  getServiceDetail,
  updateServiceStatus,
  createService,
  updateService
}
