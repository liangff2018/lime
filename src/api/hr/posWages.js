import { axios } from '@/utils/request'

const api = {
  base: '/hr/posWages',
  findPage: '/hr/posWages/findPage'
}

export default api

export function loadPosData () {
  return axios({
    url: `${api.base}/loadPosData`,
    method: 'post'
  })
}
export function add (posWages) {
  return axios({
    url: api.base,
    method: 'post',
    data: posWages
  })
}

export function update (posWages) {
  return axios({
    url: api.base,
    method: 'put',
    data: posWages
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
