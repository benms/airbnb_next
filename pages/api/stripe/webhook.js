import { Booking } from '../../../model.js'
import getRawBody from 'raw-body'


export const config = {
  api: {
    bodyParser: false
  }
}

const webHookReq = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers['stripe-signature']

  const rawBody = await getRawBody(req, {
    encoding: 'utf-8'
  })

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({
      status: 'success',
      message: `Webhook Error: ${err.message}`
    })
    return
  }

  if (event.type === 'checkout.session.completed') {
    const sessionId = event.data.object.id

    try {
      Booking.update({ paid: true }, { where: { sessionId } })
      console.log('done')
    } catch (err) {
      console.error(err)
    }
  }

  res.json({ received: true })
}

export default webHookReq
