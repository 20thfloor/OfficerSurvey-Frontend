/* eslint-disable no-useless-escape */
import {
  removeIsSuperUser,
  removeUserId,
  removeUserRefreshToken,
  removeIsSupervisor,
  removePlan,
  removeProfilePic,
  removeUserAccessToken,
  getTokenCreationTimeStamp
} from './localStorage'
import moment from 'moment'

export const allnumeric = inputtxt => {
  const numbers = /^[0-9-()]+$/
  if (inputtxt.match(numbers)) {
    return true
  } else {
    return false
  }
}

export const emailFormatVerification = email => {
  //eslint-disable-next-line
  const emailFormat =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return !emailFormat.test(email)
}
export const clearLocalStorage = async () => {
  await removeUserAccessToken()
  await removeUserRefreshToken()
  await removeUserId()
  await removeIsSupervisor()
  await removeIsSuperUser()
  await removePlan()
  await removeProfilePic()
}

export const convertDateToFormatedString = date => {
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const year = date.getFullYear()
  return month + '-' + d + '-' + year
}

export const dateToLocalString = date => {
  return moment(date).format('MMMM Do YYYY, h:mm a')
}

export const convertDate = date => {
  if (date) {
    return moment(date).format('MMMM Do YYYY, h:mm a')
  } else {
    return '---'
  }
}

export const createFormDataObject = formInputData => {
  const formData = new FormData()
  for (const key in formInputData) {
    formData.append(key, formInputData[key])
  }
  return formData
}

export const validateQueSubmission = obj => {
  if (obj.question.length === 0) {
    return false
  }

  if (obj.type === 'Drop Down' || obj.type === 'Multiple Choice' || obj.type === 'Poll' || obj.type === 'Vote') {
    if (obj.choices.length === 0) {
      return false
    }
  }

  const lengthZero = item => item.choice.length !== 0
  const choicesLengthZero = obj.choices.every(lengthZero)

  if (choicesLengthZero === false) {
    return false
  }
  if (obj.type.length === 0) {
    return false
  }
  return true
}

export const validateSurvey = (surveyList, answersList) => {
  return surveyList.questions.every(
    item =>
      // eslint-disable-next-line no-prototype-builtins
      (item.required && answersList.hasOwnProperty(item.id)
        ? item.type === 'Text Area'
          ? answersList[item.id].text.length > 0
          : true
        : false) || !item.required
  )
}

export const validateDepartmentSurvey = (surveyList, answersList) => {
  return surveyList.questions.every(
    item =>
      // eslint-disable-next-line no-prototype-builtins
      (item.required && answersList.hasOwnProperty(item.id)
        ? item.type === 'Text Area'
          ? answersList[item.id].comment.length > 0
          : true
        : false) || !item.required
  )
}

export const isAccessTokenExpired = async () => {
  const tokenCreationTimeStamp = moment(await getTokenCreationTimeStamp())
  const currentDateTimeStamp = moment(new Date())
  return currentDateTimeStamp.diff(tokenCreationTimeStamp, 'minutes') > 2
}
