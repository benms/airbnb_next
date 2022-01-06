import Cookies from 'cookies'

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

export {
  randomString,
  getSessionFromCookies,
  setSessionToCookies,
  calcNumberOfNightsBetweenDates,
}