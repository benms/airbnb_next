import { User } from '../../../model'
import { randomString } from '../../../helpers'

const registerRequest = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  try {
    const { email, password, passwordConfirmation } = req.body

    if (password !== passwordConfirmation) {
      res.end(
        JSON.stringify({ status: 'error', message: 'Passwords do not match' })
      )
      return
    }

    let user = await User.findOne({ where: { email } })

    if (!user) {
      user = await User.create({ email, password })

      const sessionToken = randomString(255)
      const d = new Date()
      d.setDate(d.getDate() + 30)
      User.update(
        {
          session_token: sessionToken,
          session_expiration: d
        },
        { where: { email } }
      )
      res.json({ status: 'success', message: 'User added' })
    } else {
      res.json({ status: 'error', message: 'User already exists' })
    }

  } catch (err) {
    console.error(err)
  }

}

export default registerRequest
