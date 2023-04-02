
import Layout2021 from '../../components/Layout2021';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'
import TEAMS from '../../constants/teams';

export default function Month({ hrs, month }) {
  return (
    <Layout2021 title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} teams={TEAMS} />
    </Layout2021>
  )
}

export const getStaticProps = async ({ params: { month }}) => {
  const hrs = await getHomeRunData({ month, year: 2021 })
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1)
    }
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