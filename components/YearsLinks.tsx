import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function YearsLinks() {
  return (
    <div className={styles.flex}>
      <Link legacyBehavior href="/2021">
        <a>2021</a>
      </Link>
      <Link legacyBehavior href="/2022">
        <a>2022</a>
      </Link>
      <Link legacyBehavior href="/2023">
        <a>2023</a>
      </Link>
      <Link legacyBehavior href="/">
        <a>2026</a>
      </Link>
    </div>
  )
}
