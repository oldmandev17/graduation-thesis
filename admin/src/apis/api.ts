import { LogMethod, LogName, LogStatus } from 'modules/log'
import { ServiceStatus } from 'modules/service'
import { axiosJson } from './axios'

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
  let url = `/log?createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}&&sortBy=${sortBy}&&orderBy=${orderBy}`
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
  page: number,
  limit: number,
  status: ServiceStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date,
  endDay: Date,
  parent: string,
  level: number | undefined,
  accessToken: string | undefined
) {
  let url = `/service?createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}&&sortBy=${sortBy}&&orderBy=${orderBy}`
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

function getAllUser(status: LogStatus) {
  let url = '/api/log'
  if (status) url += `status=${status}`
  return axiosJson.get(url)
}

export { getAllLog, getAllUser, deleteLog, getAllService, deleteService, updateServiceStatus }
