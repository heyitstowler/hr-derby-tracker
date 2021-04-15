import Head from 'next/head'
import { useMemo, useState } from 'react';
import SortableTable from '../components/SortableTable';
import TeamsLists from '../components/TeamsLists';
import TEAMS from '../constants/teams';
import styles from '../styles/Home.module.css'
import { getHomeRunData } from './api/baseball'

export default function Home({ hrs }) {

  // const [sort, setSort] = useState({ by: 'hrs', asc: false})
  // const hrList = useMemo(() => {
  //   if (sort.by === 'a-z') {
  //     return toSortedList(hrs, { asc: sort.asc })
  //   } else {
  //     return toSortedList(hrs, { fn: byHomeRuns, asc: sort.asc })
  //   }
  // }, [sort.by, sort.asc])

  // const { by, asc } = sort

  return (
    <div className={styles.container}>
      <Head>
        <title>HR Derby</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header id="top">
        <h1>Home Run Derby</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.mobile}>
          <a href="#standings">Standings</a>
          <a href="#player-stats">Player Stats</a>
        </section>
        <section id="standings">
          <h2>Standings</h2>
          <TeamsLists teams={TEAMS} stats={hrs} />
        </section>
        <section id="player-stats">
          <h2>Player Stats</h2>
          <SortableTable headings={['Player', 'HRs']} data={hrs} />
        </section>
      </main>

      <div className={`${styles.mobile} ${styles.top}`}>
        <a href="#top">🔝</a>
      </div>

      <footer className={styles.footer}>
        
      </footer>
    </div>
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