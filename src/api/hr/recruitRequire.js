import { axios } from '@/utils/request'

const api = {
  base: '/hr/recruitRequire',
  findPage: '/hr/recruitRequire/findPage',
  updateBillState: '/hr/recruitRequire/updateBillState'
}

export default api

export function updateBillState (id, billState) {
  return axios({
    url: `${api.updateBillState}/${id}/${billState}`,
    method: 'put'
  })
}

export function add (recruitRequire) {
  return axios({
    url: api.base,
    method: 'post',
    data: recruitRequire
  })
}

export function update (recruitRequire) {
  return axios({
    url: api.base,
    method: 'put',
    data: recruitRequire
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
