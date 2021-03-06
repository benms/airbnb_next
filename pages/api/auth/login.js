import { User, House } from '../../../model'
import { randomString } from '../../../helpers'
import { setSessionToCookies } from '../../../helpers'


const Login = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  const { email, password } = req.body

  let user = await User.findOne({ where: { email } })

  if (!user) {
    res.json({ status: 'error', message: 'User does not exist' })
    return
  }

  const isPasswordValid = await user.isPasswordValid(password)

  if (!isPasswordValid) {
    res.json({ status: 'error', message: 'Password not valid' })
    return
  }

  let sessionToken = null
  const sessionExpiration = new Date()
  sessionExpiration.setDate(sessionExpiration.getDate() + 30)

  if (new Date(user.session_expiration) < new Date()) {
    sessionToken = randomString(255)
    User.update(
      {
        session_token: sessionToken,
        session_expiration: sessionExpiration
      },
      { where: { email } }
    )
  } else {
    sessionToken = user.session_token
    User.update(
      {
        session_expiration: sessionExpiration
      },
      { where: { email } }
    )
  }

  setSessionToCookies({ req, res, sessionToken })
  res.json({ status: 'success', message: 'Logged in' })
}

export default Login
