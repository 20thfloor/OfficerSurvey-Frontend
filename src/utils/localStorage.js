import SimpleCrypto from 'simple-crypto-js'
import { updateAuthToken } from './api'
import { isAccessTokenExpired } from './helpers'

const officerKey = 'officer-key'
const simpleCrypto = new SimpleCrypto(officerKey)

export const setUserAccesssToken = async access_token => {
  const access_token_encrypted = simpleCrypto.encrypt(access_token)
  return await localStorage.setItem('access_token', access_token_encrypted)
}

export const setTokenCreationTimeStamp = async () => {
  const date = simpleCrypto.encrypt(new Date())
  return await localStorage.setItem('token_creation_date', date)
}

export const setUserRefreshToken = async refresh_token => {
  const refresh_token_encrypted = simpleCrypto.encrypt(refresh_token)
  return await localStorage.setItem('refresh_token', refresh_token_encrypted)
}

export const setUserId = async id => {
  const userId_encrypted = simpleCrypto.encrypt(id)
  return await localStorage.setItem('user_id', userId_encrypted)
}

export const setIsSupervisor = async isSupervisor => {
  const isSupervisor_encrypted = simpleCrypto.encrypt(isSupervisor)
  return await localStorage.setItem('is_supervisor', isSupervisor_encrypted)
}

export const setIsSuperUser = async isSuperUser => {
  const isSuperUser_encrypted = simpleCrypto.encrypt(isSuperUser)
  return await localStorage.setItem('is_super_user', isSuperUser_encrypted)
}

export const setProfilePic = async profilePic => {
  const profilePic_encrypted = simpleCrypto.encrypt(profilePic)
  return await localStorage.setItem('profile_pic', profilePic_encrypted)
}

export const setPlan = async plan => {
  const plan_encrypted = simpleCrypto.encrypt(plan)
  return await localStorage.setItem('plan', plan_encrypted)
}

export const getUserAccessToken = async () => {
  try {
    const userId = await getUserId()
    if (!userId) {
      return null
    }
    if (isAccessTokenExpired()) {
      await updateAuthToken()
    }
    const newAccess_Token = await localStorage.getItem('access_token')
    const access_token_decrypted = await simpleCrypto.decrypt(newAccess_Token)
    return access_token_decrypted
  } catch (error) {
    return null
  }
}

export const getUserRefreshToken = async () => {
  try {
    var newRefresh_Token = await localStorage.getItem('refresh_token')
    const refresh_token_decrypted = await simpleCrypto.decrypt(newRefresh_Token)
    return refresh_token_decrypted
  } catch (error) {
    return null
  }
}
export const getUserId = async () => {
  try {
    var newUserId = await localStorage.getItem('user_id')
    const userId_decrypted = await simpleCrypto.decrypt(newUserId)
    return userId_decrypted
  } catch (error) {
    return null
  }
}
export const getIsSupervisor = async () => {
  try {
    var newIsSupervisor = await localStorage.getItem('is_supervisor')
    const isSupervisor_decrypted = await simpleCrypto.decrypt(newIsSupervisor)
    return isSupervisor_decrypted
  } catch (error) {
    return null
  }
}
export const getIsSuperUser = async () => {
  try {
    var newIsSuperUser = await localStorage.getItem('is_super_user')
    const isSuperUser_decrypted = await simpleCrypto.decrypt(newIsSuperUser)
    return isSuperUser_decrypted
  } catch (error) {
    return null
  }
}
export const getProfilePic = async () => {
  try {
    var newProfilePic = await localStorage.getItem('profile_pic')
    const profilePic_decrypted = await simpleCrypto.decrypt(newProfilePic)
    return profilePic_decrypted
  } catch (error) {
    return null
  }
}
export const getPlan = async () => {
  try {
    var newPlan = await localStorage.getItem('plan')
    const plan_decrypted = await simpleCrypto.decrypt(newPlan)
    return plan_decrypted
  } catch (error) {
    return null
  }
}

export const removeUserAccessToken = async () => {
  await localStorage.removeItem('access_token')
}
export const removeUserRefreshToken = async () => {
  await localStorage.removeItem('refresh_token')
}
export const removeUserId = async () => {
  await localStorage.removeItem('user_id')
}
export const removeIsSupervisor = async () => {
  await localStorage.removeItem('is_supervisor')
}
export const removeIsSuperUser = async () => {
  await localStorage.removeItem('is_super_user')
}
export const removePlan = async () => {
  await localStorage.removeItem('plan')
}
export const removeProfilePic = async () => {
  await localStorage.removeItem('profile_pic')
}

export const removeTokenCreationTimeStamp = async () => {
  return await localStorage.removeItem('token_creation_date')
}

export const setEmployeeUrlList = async url => {
  var url_list = await getEmployeeUrlList()
  url_list.push(url)
  var arrayString = JSON.stringify(url_list)
  return await localStorage.setItem('url_list', arrayString)
}

export const getEmployeeUrlList = async () => {
  var url_list = await localStorage.getItem('url_list')
  if (url_list === null) url_list = '[]'
  return JSON.parse(url_list)
}

export const setCommunityUrlList = async url => {
  var url_list = await getEmployeeUrlList()
  url_list.push(url)
  var arrayString = JSON.stringify(url_list)
  return await localStorage.setItem('url_list', arrayString)
}

export const getCommunityUrlList = async () => {
  var url_list = await localStorage.getItem('url_list')
  if (url_list === null) url_list = '[]'
  return JSON.parse(url_list)
}

export const getTokenCreationTimeStamp = async () => {
  try {
    const token_creation_date = localStorage.getItem('token_creation_date')
    const token_creation_date_decrypted = await simpleCrypto.decrypt(token_creation_date)
    return token_creation_date_decrypted
  } catch (error) {
    return null
  }
}
