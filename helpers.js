import Cookies from 'cookies'
import axios from 'axios'

const COOKIE_SESSION_NAME='nextbnb_session'

const randomString = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}

const calcNumberOfNightsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate) //clone
  const end = new Date(endDate) //clone
  let dayCount = 0

  while (end > start) {
    dayCount++
    start.setDate(start.getDate() + 1)
  }

  return dayCount
}

const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  while (startDate < endDate) {
    dates = [...dates, new Date(startDate)]
    startDate.setDate(startDate.getDate() + 1)
  }
  dates = [...dates, endDate]
  return dates
}

const getSessionFromCookies = ({ req, res }) => {
  const cookies = new Cookies(req, res)

  return cookies.get(COOKIE_SESSION_NAME)
}

const setSessionToCookies = ({ req, res, sessionToken }) => {
  const cookies = new Cookies(req, res)
  cookies.set(COOKIE_SESSION_NAME, sessionToken, {
    httpOnly: true // true by default
  })
}

const getBookedDates = async (houseId) => {
  try {
    //todo: fix localhost:3000 (wrong port)
    const response = await axios.post(
      'http://localhost:3000/api/houses/booked',
      { houseId }
    )
    if (response.data.status === 'error') {
      alert(response.data.message)
      return
    }
    return response.data.dates
  } catch (error) {
    console.error(error)
    return
  }
}

export {
  randomString,
  getSessionFromCookies,
  setSessionToCookies,
  calcNumberOfNightsBetweenDates,
  getBookedDates,
  getDatesBetweenDates,
}