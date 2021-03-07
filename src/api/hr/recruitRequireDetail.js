import { axios } from '@/utils/request'

const api = {
  base: '/hr/recruitRequireDetail',
  findPage: '/hr/recruitRequireDetail/findPage'
}

export default api

export function add (recruitRequireDetail) {
  return axios({
    url: api.base,
    method: 'post',
    data: recruitRequireDetail
  })
}

export function update (recruitRequireDetail) {
  return axios({
    url: api.base,
    method: 'put',
    data: recruitRequireDetail
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
