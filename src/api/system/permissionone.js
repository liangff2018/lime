import { axios } from '@/utils/request'

const api = {
  base: '/permission',
  findPage: '/permission/findPage',
  disable: '/permission/disable',
  enable: '/permission/enable'
}

export default api

export function add (permission) {
  return axios({
    url: api.base,
    method: 'post',
    data: permission
  })
}

export function update (permission) {
  return axios({
    url: api.base,
    method: 'put',
    data: permission
  })
}

export function deleteById (id) {
  return axios({
    url: `${api.base}/${id}`,
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

export function permissionDisable (id) {
  return axios({
    url: `${api.disable}/${id}`,
    method: 'put'
  })
}

export function permissionEnable (id) {
  return axios({
    url: `${api.enable}/${id}`,
    method: 'put'
  })
}
