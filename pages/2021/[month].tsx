import Layout2021 from '../../components/Layout2021'
import Stats from '../../components/Stats'
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { HRData } from '../../types'

interface MonthProps {
  hrs: HRData
  month: string
}

export default function Month({ hrs, month }: MonthProps) {
  return (
    <Layout2021 title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} teams={TEAMS} />
    </Layout2021>
  )
}

export const getStaticProps: GetStaticProps<MonthProps, { month: string }> = async ({ params }) => {
  const month = params!.month
  const hrs = await getHomeRunData({ month, year: 2021 })
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1)
    }
  }
}

const months = ['april', 'may', 'june', 'july', 'august', 'september']

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: months.map(month => ({
      params: { month }
    })),
    fallback: false,
  }
}
