import { axios } from '@/utils/request'

const api = {
  base: '/sys/sysCode',
  findPage: '/sys/sysCode/findPage'
}

export default api

export function createNextNo (key, format) {
  const param = new URLSearchParams()
  param.append('key', key)
  param.append('format', format)

  return axios({
    url: `${api.base}/createNextNo`,
    method: 'post',
    data: param
  })
}

export function add (sysCode) {
  return axios({
    url: api.base,
    method: 'post',
    data: sysCode
  })
}

export function update (sysCode) {
  return axios({
    url: api.base,
    method: 'put',
    data: sysCode
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
