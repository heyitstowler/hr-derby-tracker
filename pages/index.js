
import Layout from '../components/Layout';
import Stats from '../components/Stats';
import TEAMS from '../constants/teams-2023';
import { getHomeRunData } from './api/baseball'
import { fetchOptimalTeam } from './api/knapsack';

const year = new Date().getFullYear()

export default function Home({ hrs, optimal }) {
  return (
    <Layout year={year}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const hrs = await getHomeRunData({ year })
  const optimal = await fetchOptimalTeam({ year })

  return {
    props: {
      hrs,
      optimal
    }
  }
}