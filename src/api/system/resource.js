import { axios } from '@/utils/request'

const api = {
  base: '/resource',
  findPage: '/resource/findPage'
}

export function add (resource) {
  return axios({
    url: api.base,
    method: 'post',
    data: resource
  })
}

export function update (resource) {
  return axios({
    url: api.base,
    method: 'put',
    data: resource
  })
}

export function findById (id) {
  return axios({
    url: `${api.base}/${id}`,
    method: 'get'
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

export function findPage (param) {
  return axios({
    url: api.findPage,
    method: 'get',
    params: param
  })
}
