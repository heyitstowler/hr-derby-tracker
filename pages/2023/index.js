
import Layout from '../../components/Layout';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2023';
import { fetchOptimalTeam } from '../api/knapsack';

export default function Home({ hrs, optimal }) {
  return (
    <Layout year={2023}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const hrs = await getHomeRunData({ year: 2023 })
  const optimal = await fetchOptimalTeam({ year: 2023 })

  return {
    props: {
      hrs,
      optimal
    },
    revalidate: 60 * 60
  }
}