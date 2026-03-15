import Layout from '../../components/Layout'
import Stats from '../../components/Stats'
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2023'
import { fetchOptimalTeam } from '../api/knapsack'
import type { GetStaticProps } from 'next'
import type { HRData, OptimalTeam } from '../../types'

interface HomeProps {
  hrs: HRData
  optimal: OptimalTeam | null
}

export default function Home({ hrs, optimal }: HomeProps) {
  return (
    <Layout year={2023}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const hrs = await getHomeRunData({ year: 2023 })
  const optimal = await fetchOptimalTeam({ year: 2023 })

  return {
    props: {
      hrs,
      optimal: optimal.error ? null : optimal
    },
    revalidate: 60 * 60
  }
}
