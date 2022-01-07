import { Booking } from '../../../model.js'
import { Sequelize } from 'sequelize'
import { getDatesBetweenDates } from '../../../helpers'

const bookedRequest = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }
  const houseId = req.body.houseId

  const results = await Booking.findAll({
    where: {
      houseId: houseId,
      endDate: {
        [Sequelize.Op.gte]: new Date()
      }
    }
  })

  let bookedDates = []

  for (const result of results) {
    const dates = getDatesBetweenDates(
      new Date(result.startDate),
      new Date(result.endDate)
    )

    bookedDates = [...bookedDates, ...dates]
  }

  //remove duplicates
  bookedDates = [...new Set(bookedDates.map((date) => date))]

  res.json({
    status: 'success',
    message: 'ok',
    dates: bookedDates
  })
}

export default bookedRequest
