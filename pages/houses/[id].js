import Head from 'next/head'
import axios from 'axios'
import Layout from '../../components/Layout'
import DateRangePicker from '../../components/DateRangePicker'
import { useState, useEffect } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  calcNumberOfNightsBetweenDates,
  getSessionFromCookies,
  getBookedDates,
  canReserveHouse,
} from '../../helpers'
import { House as HouseModel } from '../../model.js'

export default function House({ house, nextbnb_session, bookedDates }) {
  const setShowLoginModal = useStoreActions((actions) => actions.modals.setShowLoginModal)
  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)
  const loggedIn = useStoreState((state) => state.login.loggedIn)

  const handleReserve = async () => {
    try {
      if (!(await canReserveHouse(house.id, startDate, endDate))) {
        alert('The dates chosen are not valid')
        return
      }

      const sessionResponse = await axios.post('/api/stripe/session', {
        amount: house.price * numberOfNightsBetweenDates
      })
      if (sessionResponse.data.status === 'error') {
        alert(sessionResponse.data.message)
        return
      }

      const sessionId = sessionResponse.data.sessionId
      const stripePublicKey = sessionResponse.data.stripePublicKey

      const stripe = Stripe(stripePublicKey)
      const { error } = await stripe.redirectToCheckout({ sessionId })

      const response = await axios.post('/api/reserve', {
        houseId: house.id,
        startDate,
        endDate,
      })
      if (response.data.status === 'error') {
        alert(response.data.message)
        return
      }
      console.log(response.data)
    } catch (error) {
      console.log(error)
      return
    }
  }

  useEffect(() => {
    if (nextbnb_session) {
      setLoggedIn(true)
    }
  }, [])

  return (
    <Layout
      content={
        <div className="container">
          <Head>
            <title>{house.title}</title>
          </Head>
          <article>
            <img src={house.picture} width="100%" alt="House picture" />
            <p>
              {house.type} - {house.town}
            </p>
            <p>{house.title}</p>
          </article>
          <aside>
          <h2>Choose a date</h2>
            <DateRangePicker
                datesChanged={(startDate, endDate) => {
                  setNumberOfNightsBetweenDates(
                    calcNumberOfNightsBetweenDates(startDate, endDate)
                  )
                  setDateChosen(true)
                  setStartDate(startDate)
                  setEndDate(endDate)
                }}
                bookedDates={bookedDates}
            />

            {
              dateChosen && (
                <div>
                  <h2>Price per night</h2>
                  <p>${house.price}</p>
                  <h2>Total price for booking</h2>
                  <p>${(numberOfNightsBetweenDates * house.price).toFixed(2)}</p>
                  {
                    loggedIn ? (
                      <button
                        className="reserve"
                        onClick={() => {
                          handleReserve()
                        }}
                      >
                        Reserve
                      </button>
                    ) : (
                      <button
                        className="reserve"
                        onClick={() => {
                          setShowLoginModal()
                        }}
                      >
                        Log in to Reserve
                      </button>
                    )
                  }
                </div>
              )
            }

          </aside>

          <style jsx='true'>
            {`
            .container {
              display: grid;
              grid-template-columns: 60% 40%;
              grid-gap: 30px;
            }

            aside {
              border: 1px solid #ccc;
              padding: 20px;
            }

            button {
              background-color: rgb(255, 90, 95);
              color: white;
              font-size: 13px;
              width: 100%;
              border: none;
              height: 40px;
              border-radius: 4px;
              cursor: pointer;
            }
          `}
          </style>
        </div>
      }
    />
  )
}

export async function getServerSideProps({ req, res, query }) {
  const { id } = query
  const house = await HouseModel.findByPk(id)
  const bookedDates = await getBookedDates(id)

  return {
    props: {
      house: house.dataValues,
      nextbnb_session: getSessionFromCookies({ req, res }) || null,
      bookedDates
    }
  }
}
