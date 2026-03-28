import Layout from '../../components/Layout'
import Stats from '../../components/Stats'
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2026'
import draftData2026, { TOTAL_TEAMS_2026 } from '../../constants/draftData2026'
import { fetchOptimalTeam } from '../api/knapsack'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { HRData, OptimalTeam } from '../../types'

interface MonthProps {
  hrs: HRData
  month: string
  optimal: OptimalTeam | null
}

export default function Month({ hrs, month, optimal }: MonthProps) {
  return (
    <Layout year={2026} title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} teams={TEAMS} optimal={optimal} draftData={draftData2026} totalTeams={TOTAL_TEAMS_2026} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<MonthProps, { month: string }> = async ({ params }) => {
  const month = params!.month
  const hrs = await getHomeRunData({ month, year: 2026 })
  const optimal = await fetchOptimalTeam({ month, year: 2026 })
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1),
      optimal: optimal.error ? null : optimal,
    },
    revalidate: 60 * 60
  }
}

const months = ['april', 'may', 'june', 'july', 'august', 'september']

const first = (arr: string[], num: number): string[] => {
  const results: string[] = []
  while (results.length < arr.length && results.length < num) {
    results.push(arr[results.length])
  }
  return results
}

export const getStaticPaths: GetStaticPaths = async () => {
  const month = new Date().getMonth()
  const currentMonth = month > 8 ? 5 : month - 2
  return {
    paths: first(months, currentMonth).map(month => ({
      params: { month }
    })),
    fallback: false,
  }
}
