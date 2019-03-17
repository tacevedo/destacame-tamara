import endpoints from '../../endpoints'
import axios from 'axios'

const url = endpoints.base
const base = `${url}/`
const auth = {'user': 'tamara_acevedo', 'pass': 'destacametamara'}

export default {
  selectAll (urlModel) {
    const request = `${base}${urlModel}/all`
    return axios.post(request, {...auth})
  },
  select (urlModel, id) {
    const request = `${base}${urlModel}/${id}`
    return axios.post(request, {...auth})
  },
  insert (urlModel, params) {
    const request = `${base}${urlModel}`
    return axios.post(request, {...auth, ...params})
  },
  update (urlModel, id, params) {
    const request = `${base}${urlModel}/${id}`
    console.log('update req', request, params)
    return axios.put(request, {...auth, ...params})
  },
  delete (urlModel, id) {
    const request = `${base}${urlModel}/${id}`
    console.log('delete req', request)
    return axios.delete(request, {data:{...auth}})
  }
}
