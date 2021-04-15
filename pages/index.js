
import Layout from '../components/Layout';
import Stats from '../components/Stats';
import { getHomeRunData } from './api/baseball'

export default function Home({ hrs }) {
  return (
    <Layout>
      <Stats hrs={hrs} />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const hrs = await getHomeRunData()
  return {
    props: {
      hrs
    }
  }
}