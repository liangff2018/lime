import { axios } from '@/utils/request'

const api = {
  base: '/sys/staticData',
  findPage: '/sys/staticData/findPage',
  findItemsByName: '/sys/staticData/findStaticDataItemsByName'
}

export default api

export function add (staticData) {
  return axios({
    url: api.base,
    method: 'post',
    data: staticData
  })
}

export function update (staticData) {
  return axios({
    url: api.base,
    method: 'put',
    data: staticData
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

export function stateChange (id) {
  return axios({
    url: `${api.base}/${id}`,
    method: 'put'
  })
}

export function findItemsByName (name, state) {
  return axios({
    url: `${api.findItemsByName}?name=${name}&state=${state}`,
    method: 'get'
  })
}
