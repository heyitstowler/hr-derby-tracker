
import Layout2021 from '../../components/Layout2021';
import Stats from '../../components/Stats';
import { getHomeRunData } from '../api/baseball'

export default function Home({ hrs }) {
  return (
    <Layout2021>
      <Stats hrs={hrs} />
    </Layout2021>
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