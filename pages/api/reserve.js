import { User, Booking } from '../../model.js'

const reverseRequest = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  const user_session_token = req.cookies.nextbnb_session
  if (!user_session_token) {
    res.status(401).end()
    return
  }

  const user = await User.findOne({ where: { session_token: user_session_token } })
  await Booking.create({
    houseId: req.body.houseId,
    userId: user.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  })
  res.json({ status: 'success', message: 'ok' })
}

export default reverseRequest
