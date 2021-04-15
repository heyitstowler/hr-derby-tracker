
import Layout from '../components/Layout';
import Stats from '../components/Stats';
import { getHomeRunData } from './api/baseball'

export default function Month({ hrs, month }) {
  return (
    <Layout title={"Home Run Derby - " + month}>
      <Stats hrs={hrs} />
    </Layout>
  )
}

export const getServerSideProps = async ({ params: { month }}) => {
  const hrs = await getHomeRunData(month)
  return {
    props: {
      hrs,
      month: month[0].toUpperCase() + month.slice(1)
    }
  }
}