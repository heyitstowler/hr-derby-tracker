
import Layout2021 from '../../components/Layout2021';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams';

export default function Home({ hrs }) {
  return (
    <Layout2021>
      <Stats hrs={hrs} teams={TEAMS} />
    </Layout2021>
  )
}

export const getStaticProps = async () => {
  const hrs = await getHomeRunData({ year: 2021 })
  return {
    props: {
      hrs
    }
  }
}