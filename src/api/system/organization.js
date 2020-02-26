import { axios } from '@/utils/request'

const api = {
  base: '/organization',
  findByParentId: '/organization/findByParentId',
  disableOrgById: '/organization/disableOrgById',
  enableOrgById: '/organization/enableOrgById',
  deleteOrgById: '/organization/deleteOrgById'
}

export default api

export function findOrgById (id) {
  return axios({
    url: api.base + '/' + id,
    method: 'get'
  })
}

export function findOrgByParentId (parentId) {
  return axios({
    url: `${api.findByParentId}/` + (parentId === undefined ? 0 : parentId),
    method: 'get'
  })
}

export function addOrg (organization) {
  return axios({
    url: api.base,
    method: 'post',
    data: organization
  })
}

export function updateOrg (organization) {
  return axios({
    url: api.base,
    method: 'put',
    data: organization
  })
}

export function disableOrgById (id) {
  return axios({
    url: `${api.disableOrgById}/${id}`,
    method: 'post'
  })
}

export function enableOrgById (id) {
  return axios({
    url: `${api.enableOrgById}/${id}`,
    method: 'post'
  })
}

export function deleteOrgById (id) {
  return axios({
    url: `${api.deleteOrgById}/${id}`,
    method: 'delete'
  })
}
