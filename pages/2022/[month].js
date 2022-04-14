
import Layout from '../../components/Layout';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams-2022';

export default function Month({ hrs, month }) {
  return (
    <Layout title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} teams={TEAMS} />
    </Layout>
  )
}

export const getServerSideProps = async ({ params: { month }}) => {
  const hrs = await getHomeRunData({ month, year: 2022 })
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1)
    }
  }
}