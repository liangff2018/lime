import { axios } from '@/utils/request'
import qs from 'qs'

const api = {
  base: '/user',
  addUserToOrg: '/user/addUserToOrg',
  updateUserAndOrg: '/user/updateUserAndOrg'
}

export default api

export function findUserById (id) {
  return axios({
    url: `${api.base}/${id}`,
    method: 'get'
  })
}

export function addUserToOrg (user) {
  return axios({
    url: api.addUserToOrg,
    method: 'post',
    data: qs.stringify(user)
  })
}

export function updateUserAndOrg (user) {
  return axios({
    url: api.updateUserAndOrg,
    method: 'put',
    data: qs.stringify(user)
  })
}
