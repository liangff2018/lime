import { axios } from '@/utils/request'

const api = {
  base: '/hr/leaveOffice',
  findPage: '/hr/leaveOffice/findPage',
  approval: '/hr/leaveOffice/approval'
}

export default api

export function approval (id, billState) {
  return axios({
    url: `${api.approval}/${id}/${billState}`,
    method: 'put'
  })
}

export function add (leaveOffice) {
  return axios({
    url: api.base,
    method: 'post',
    data: leaveOffice
  })
}

export function update (leaveOffice) {
  return axios({
    url: api.base,
    method: 'put',
    data: leaveOffice
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
