
import Layout from '../../components/Layout';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2023';
import { fetchOptimalTeam } from '../api/knapsack';

export default function Month({ hrs, month, optimal }) {
  return (
    <Layout year={2023} title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getStaticProps = async ({ params: { month }}) => {
  const hrs = await getHomeRunData({ month, year: 2023 })
  const optimal = await fetchOptimalTeam({ month, year: 2023 })
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1),
      optimal,
    },
    revalidate: 60 * 60
  }
}

const months = ['april', 'may', 'june', 'july', 'august', 'september']

export const getStaticPaths = async () => {
  return {
    paths: months.map(month => ({
      params: { month }
    })),
    fallback: false,
  }
}