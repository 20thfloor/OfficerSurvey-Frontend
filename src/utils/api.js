import axios from 'axios'
import { getUserAccessToken, getUserRefreshToken, setUserAccesssToken } from './localStorage'
import { refreshTokenUrl } from '../utils/apiUrls'

export const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`

axios.defaults.baseURL = BASE_URL

export const getAPI = async (url, query = null) => {
  await setApiHeader()
  try {
    const res = await axios.get(url, {
      params: query
    })
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const getAPIWithoutAuth = async (url, query = null) => {
  try {
    delete axios.defaults.headers.common.Authorization
    const res = await axios.get(url, {
      params: query
    })
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const putAPIWrapper = async (url, body) => {
  await setApiHeader()
  try {
    const res = await axios.put(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}
export const patchAPIWrapper = async (url, body) => {
  await setApiHeader()
  try {
    const res = await axios.patch(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}
export const patchAPIWrapperWithoutAuth = async (url, body) => {
  try {
    delete axios.defaults.headers.common.Authorization

    const res = await axios.patch(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const putAPIFormDataWrapper = async (url, body) => {
  await setApiHeader()
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
  try {
    const res = await axios.put(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const deleteAPIWrapper = async url => {
  await setApiHeader()
  try {
    const res = await axios.delete(url)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const postAPIFormDataWrapper = async (url, body) => {
  await setApiHeader()
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
  try {
    const res = await axios.post(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response,
      data: {},
      isError: true
    }
  }
}

export const postAPIFormDataWrapperWithoutAuth = async (url, body) => {
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
  try {
    const res = await axios.post(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const postAPIWrapper = async (url, body) => {
  await setApiHeader()
  try {
    const res = await axios.post(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const postAPIWithoutAuth = async (url, body) => {
  try {
    delete axios.defaults.headers.common.Authorization
    const res = await axios.post(url, body)
    return { data: res, error: {}, isError: false }
  } catch (err) {
    return {
      error: err.response.data,
      data: {},
      isError: true
    }
  }
}

export const postAPI = async (url, body) => {
  await setApiHeader()
  return axios.post(url, body)
}

export const updateAuthToken = async () => {
  const refresh_token = await getUserRefreshToken()
  const body = {
    refresh: refresh_token
  }
  const response = await postAPIWithoutAuth(refreshTokenUrl, body)
  if (!response.isError) {
    await setUserAccesssToken(response.data.data.access)
  }
}

const setApiHeader = async () => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + (await getUserAccessToken())
}
