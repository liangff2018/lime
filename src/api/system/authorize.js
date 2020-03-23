import { axios } from '@/utils/request'

const api = {
  base: '/authorize',
  findPage: '/authorize/findPage',
  adds: '/authorize/adds',
  deleteByOrgRoleId: '/authorize/deleteByOrgRoleId'
}

export default api

export function add (authorize) {
  return axios({
    url: api.base,
    method: 'post',
    data: authorize
  })
}

export function adds (param) {
  return axios({
    url: api.adds,
    method: 'post',
    data: param
  })
}

export function update (authorize) {
  return axios({
    url: api.base,
    method: 'put',
    data: authorize
  })
}

export function deleteById (id) {
  return axios({
    url: `${api.base}/${id}`,
    method: 'delete'
  })
}

export function deleteByOrgRoleId (orgId, roleId) {
  return axios({
    url: `${api.deleteByOrgRoleId}/${orgId}/${roleId}`,
    method: 'delete'
  })
}

export function findAll () {
  return axios({
    url: api.base,
    method: 'get'
  })
}

export function findById (id) {
  return axios({
    url: `${api.base}/${id}`,
    method: 'get'
  })
}

export function findPage (param) {
  return axios({
    url: api.findPage,
    method: 'get',
    params: param
  })
}
