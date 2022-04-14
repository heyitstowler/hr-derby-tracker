import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StaticMonthList from './StaticMonthList'
import YearsLinks from './YearsLinks'

export default function Layout({ children, title = 'Home Run Derby' }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header id="top">
        <h1>{title}</h1>
        <YearsLinks />
      </header>
      <StaticMonthList />
      <main className={styles.main}>
        {children}
      </main>

      <div className={`${styles.mobile} ${styles.top}`}>
        <a href="#top">🔝</a>
      </div>
    </div>
  )
}
