import { axios } from '@/utils/request'

const api = {
  base: '/rolePermission',
  adds: '/rolePermission/adds',
  findPage: '/rolePermission/findPage',
  findPermissionIdsByRoleId: 'rolePermission/findPermissionIdsByRoleId',
  findRolePermissionByParam: 'rolePermission/findRolePermissionByParam'
}

export default api

export function adds (rolePermissions) {
  debugger
  return axios({
    url: api.adds,
    method: 'post',
    data: rolePermissions
  })
}

export function deleteById (roleId, permissionId) {
  return axios({
    url: `${api.base}/${roleId}/${permissionId}`,
    method: 'delete'
  })
}

export function findPage (param) {
  return axios({
    url: api.findPage,
    method: 'get',
    params: param
  })
}

export function findPermissionIdsByRoleId (roleId) {
  return axios({
    url: `${api.findPermissionIdsByRoleId}/${roleId}`,
    method: 'get'
  })
}

export function findRolePermissionByParam (param) {
  return axios({
    url: api.findRolePermissionByParam,
    method: 'get',
    params: param
  })
}
