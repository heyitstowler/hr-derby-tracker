import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StaticMonthList from './StaticMonthList'
import YearsLinks from './YearsLinks'
import { type ReactNode } from 'react'

interface Layout2021Props {
  children: ReactNode
  title?: string
}

export default function Layout2021({ children, title = 'Home Run Derby' }: Layout2021Props) {
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
      <StaticMonthList year={2021} />
      <main className={styles.main}>
        {children}
      </main>

      <div className={`${styles.mobile} ${styles.top}`}>
        <a href="#top">🔝</a>
      </div>
    </div>
  )
}
