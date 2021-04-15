import Head from 'next/head'
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.css'
import { getHomeRunData } from './api/baseball'

function alphabeticalSort(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}

function byHomeRuns(a, b) {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
      return (a[1] > b[1]) ? -1 : 1;
  }
}

function toSortedList(data, {fn = alphabeticalSort, asc = false}) {
  const list = Object.entries(data)
  list.sort(
    asc ? (a, b) => fn(b, a) : fn
  )
  return list
}

export default function Home({ hrs }) {

  const [sort, setSort] = useState({ by: 'hrs', asc: false})
  const hrList = useMemo(() => {
    if (sort.by === 'a-z') {
      return toSortedList(hrs, { asc: sort.asc })
    } else {
      return toSortedList(hrs, { fn: byHomeRuns, asc: sort.asc })
    }
  }, [sort.by, sort.asc])

  const getSort = (by, asc = false) => () => setSort({ by, asc })

  return (
    <div className={styles.container}>
      <Head>
        <title>HR Derby</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header>
          <h1>Home Run Derby</h1>
        </header>
        <section>
          <button onClick={getSort('hrs')}>HRs (desc)</button>
          <button onClick={getSort('hrs', true)}>HRs (asc)</button>
          <button onClick={getSort('a-z')}>A - Z</button>
          <button onClick={getSort('a-z', true)}>Z - A</button>
        </section>
        <table>
          <thead>
            <tr>
            <td>Name</td>
            <td>HR</td>
            </tr>
          </thead>
          <tbody>
            {
              hrList.map(([name, hrs]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{hrs}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </main>

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