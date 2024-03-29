import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default () => (
  <div className={styles.flex}>
    <Link legacyBehavior href="/2021">
      <a>2021</a>
    </Link>
    <Link legacyBehavior href="/2022">
      <a>2022</a>
    </Link>
    <Link legacyBehavior href="/">
      <a>2023</a>
    </Link>
  </div>
)