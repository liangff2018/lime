import { axios } from '@/utils/request'

const api = {
  base: '/hr/staff',
  findPage: '/hr/staff/findPage'
}

export default api

export function add (staff) {
  return axios({
    url: api.base,
    method: 'post',
    data: staff
  })
}

export function update (staff) {
  return axios({
    url: api.base,
    method: 'put',
    data: staff
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
