import Layout2021 from '../../components/Layout2021'
import Stats from '../../components/Stats'
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams'
import type { GetStaticProps } from 'next'
import type { HRData } from '../../types'

interface HomeProps {
  hrs: HRData
}

export default function Home({ hrs }: HomeProps) {
  return (
    <Layout2021>
      <Stats hrs={hrs} teams={TEAMS} />
    </Layout2021>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const hrs = await getHomeRunData({ year: 2021 })
  return {
    props: {
      hrs
    }
  }
}
