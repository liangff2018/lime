import { axios } from '@/utils/request'

const api = {
  base: '/hr/interview',
  findPage: '/hr/interview/findPage'
}

export default api

export function add (interview) {
  return axios({
    url: api.base,
    method: 'post',
    data: interview
  })
}

export function update (interview) {
  return axios({
    url: api.base,
    method: 'put',
    data: interview
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
