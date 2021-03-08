import { axios } from '@/utils/request'

const api = {
  base: '/hr/recruitPlan',
  detail: '/hr/recruitPlanDetail',
  findPage: '/hr/recruitPlan/findPage',
  findPageDetailFinished: '/hr/recruitPlanDetail/findPageFinished',
  updateBillState: '/hr/recruitPlan/updateBillState'
}

export default api

export function updateBillState (id, billState) {
  return axios({
    url: `${api.updateBillState}/${id}/${billState}`,
    method: 'put'
  })
}

export function add (recruitPlan) {
  return axios({
    url: api.base,
    method: 'post',
    data: recruitPlan
  })
}

export function update (recruitPlan) {
  return axios({
    url: api.base,
    method: 'put',
    data: recruitPlan
  })
}

export function deleteDetailById (id) {
  return axios({
    url: `${api.detail}/${id}`,
    method: 'delete'
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

export function findPageDetailFinished (param) {
  return axios({
    url: api.findPageDetailFinished,
    method: 'get',
    params: param
  })
}
