import Layout from '../components/Layout'
import Stats from '../components/Stats'
import TEAMS from '../constants/teams-2026'
import { getHomeRunData } from './api/baseball'
import { fetchOptimalTeam } from './api/knapsack'
import type { GetServerSideProps } from 'next'
import type { HRData, OptimalTeam } from '../types'

const year = new Date().getFullYear()

interface HomeProps {
  hrs: HRData
  optimal: OptimalTeam | null
}

export default function Home({ hrs, optimal }: HomeProps) {
  return (
    <Layout year={year}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const hrs = await getHomeRunData({ year })
  const optimal = await fetchOptimalTeam({ year })

  return {
    props: {
      hrs,
      optimal: optimal.error ? null : optimal
    }
  }
}
