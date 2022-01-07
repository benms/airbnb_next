import Head from 'next/head'
import Layout from '../../components/Layout'
import DateRangePicker from '../../components/DateRangePicker'
import { useState, useEffect } from 'react'
import { useStoreActions } from 'easy-peasy'
import { calcNumberOfNightsBetweenDates, getSessionFromCookies } from '../../helpers'
import { House as HouseModel } from '../../model.js'

export default function House({ house, nextbnb_session }) {
  const setShowLoginModal = useStoreActions(
    (actions) => actions.modals.setShowLoginModal
  )

  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(0)
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)

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
                }}
            />

            {
              dateChosen && (
                <div>
                  <h2>Price per night</h2>
                  <p>${house.price}</p>
                  <h2>Total price for booking</h2>
                  <p>${(numberOfNightsBetweenDates * house.price).toFixed(2)}</p>
                  <button
                    className="reserve"
                    onClick={() => {
                      setShowLoginModal()
                    }}>
                      Reserve
                  </button>
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

  return {
    props: {
      house: house.dataValues,
      nextbnb_session: getSessionFromCookies({ req, res }) || null
    }
  }
}
