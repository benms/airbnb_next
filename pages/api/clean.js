import { Booking } from '../../model.js'

const cleanRequest = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  Booking.destroy({
    where: {
      paid: false
    }
  })

  res.json({
      status: 'success',
      message: 'ok'
    })
}

export default cleanRequest
