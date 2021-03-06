import { useStoreActions } from 'easy-peasy'
import { useEffect } from 'react'
import houses from '../houses'
import House from '../components/House'
import Layout from '../components/Layout'
import { getSessionFromCookies } from '../helpers'
import { House as HouseModel } from '../model.js'


const content = (
  <div>
    <h2>Places to stay</h2>

    <div className="houses">
      {houses.map((house, index) => {
        return <House key={index} {...house} />
      })}
    </div>

    <style jsx>{`
      .houses {
        display: grid;
        grid-template-columns: 49% 49%;
        grid-template-rows: 300px 300px;
        grid-gap: 2%;
      }
    `}</style>
  </div>
)

export default function Home({ nextbnb_session, houses }) {
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)

  useEffect(() => {
    if (nextbnb_session) {
      setLoggedIn(true)
    }
  }, [])

  return <Layout
  content={
    <div>
      <h2>Places to stay</h2>

      <div className="houses">
        { houses.map((house, index) => {
          return <House key={index} {...house} />
        }) }
      </div>

      <style jsx='true'>{`
        .houses {
          display: grid;
          grid-template-columns: 49% 49%;
          grid-template-rows: 300px 300px;
          grid-gap: 2%;
        }
      `}</style>
    </div>
  }
/>
}

export async function getServerSideProps({ req, res }) {
  const houses = await HouseModel.findAndCountAll()

  return {
    props: {
      nextbnb_session: getSessionFromCookies({req, res}) || null,
      houses: houses.rows.map((house) => house.dataValues)
    }
  }
}