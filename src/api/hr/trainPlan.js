import { axios } from '@/utils/request'

const api = {
  base: '/hr/trainPlan',
  findPage: '/hr/trainPlan/findPage'
}

export default api

export function add (trainPlan) {
  return axios({
    url: api.base,
    method: 'post',
    data: trainPlan
  })
}

export function update (trainPlan) {
  return axios({
    url: api.base,
    method: 'put',
    data: trainPlan
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
