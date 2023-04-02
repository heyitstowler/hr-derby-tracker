
import Layout from '../../components/Layout';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2022';
import { fetchOptimalTeam } from '../api/knapsack';

export default function Home({ hrs, optimal }) {
  return (
    <Layout>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const hrs = await getHomeRunData({ year: 2022 })
  const optimal = await fetchOptimalTeam({ year: 2022 })

  return {
    props: {
      hrs,
      optimal
    }
  }
}