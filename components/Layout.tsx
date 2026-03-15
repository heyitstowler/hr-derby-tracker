import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StaticMonthList from './StaticMonthList'
import YearsLinks from './YearsLinks'
import MonthList from './MonthList'
import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  year: number
  title?: string
}

export default function Layout({ children, year, title = 'Home Run Derby' }: LayoutProps) {
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
      {
        year === 2023
        ? <MonthList year={year}/>
        : <StaticMonthList year={year}/>
      }
      <main className={styles.main}>
        {children}
      </main>

      <div className={`${styles.mobile} ${styles.top}`}>
        <a href="#top">🔝</a>
      </div>
    </div>
  )
}
