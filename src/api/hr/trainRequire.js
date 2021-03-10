import { axios } from '@/utils/request'

const api = {
  base: '/hr/trainRequire',
  findPage: '/hr/trainRequire/findPage'
}

export default api

export function add (trainRequire) {
  return axios({
    url: api.base,
    method: 'post',
    data: trainRequire
  })
}

export function update (trainRequire) {
  return axios({
    url: api.base,
    method: 'put',
    data: trainRequire
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
