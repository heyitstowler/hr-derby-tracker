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

  const { by, asc } = sort

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
        <section className={styles.buttons}>
          <SortButton active={by === 'hrs' && !asc} sort={setSort} by="hrs" >HRs (desc)</SortButton>
          <SortButton active={by === 'hrs' && asc} sort={setSort} by="hrs" asc>HRs (asc)</SortButton>
          <SortButton active={by === 'a-z' && !asc} sort={setSort} by="a-z">A - Z</SortButton>
          <SortButton active={by === 'a-z' && asc} sort={setSort} by="a-z" asc>Z - A</SortButton>
        </section>
        <table className={styles.t}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
            <td>Name</td>
            <td>HR</td>
            </tr>
          </thead>
          <tbody>
            {
              hrList.map(([name, hrs]) => (
                <tr className={styles.tr} key={name}>
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

function SortButton({ children, sort, by, asc = false, active }) {
const getSort = (by, asc = false) => () => sort({ by, asc })

  return (
    <button
      className={`${styles['sort-button']} ${active ? styles.active : ''}`}
      onClick={getSort(by, asc)}
      >
        {children}
    </button>
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