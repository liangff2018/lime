import { axios } from '@/utils/request'

const api = {
  base: '/sys/role',
  findPage: '/sys/role/findPage'
}

export default api

export function add (role) {
  return axios({
    url: api.base,
    method: 'post',
    data: role
  })
}

export function update (role) {
  return axios({
    url: api.base,
    method: 'put',
    data: role
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
