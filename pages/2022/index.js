
import Layout from '../../components/Layout';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2022';

export default function Home({ hrs }) {
  return (
    <Layout>
      <Stats hrs={hrs} teams={TEAMS}/>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const hrs = await getHomeRunData({ year: 2022 })
  return {
    props: {
      hrs
    }
  }
}