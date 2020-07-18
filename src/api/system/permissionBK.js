import { axios } from '@/utils/request'

const api = {
  base: '/permission',
  findPage: '/permission/findPage',
  findByParentId: 'permission/findByParentId'
}

export default api

export function findByParentId (parentId = 0) {
  return axios({
    url: `${api.findByParentId}/${parentId}`,
    method: 'get'
  })
}

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
