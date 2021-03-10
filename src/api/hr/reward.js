import { axios } from '@/utils/request'

const api = {
  base: '/hr/reward',
  findPage: '/hr/reward/findPage'
}

export default api

export function add (reward) {
  return axios({
    url: api.base,
    method: 'post',
    data: reward
  })
}

export function update (reward) {
  return axios({
    url: api.base,
    method: 'put',
    data: reward
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
