import { axios } from '@/utils/request'

const api = {
  base: '/hr/transfer',
  findPage: '/hr/transfer/findPage',
  approval: '/hr/transfer/approval'
}

export default api

export function add (transfer) {
  return axios({
    url: api.base,
    method: 'post',
    data: transfer
  })
}

export function update (transfer) {
  return axios({
    url: api.base,
    method: 'put',
    data: transfer
  })
}

export function approval (id, billState) {
  return axios({
    url: `${api.approval}/${id}/${billState}`,
    method: 'put'
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
