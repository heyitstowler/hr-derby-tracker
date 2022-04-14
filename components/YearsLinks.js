import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default () => (
  <div className={styles.flex}>
    <Link href="/2021">
      <a>2021</a>
    </Link>
    <Link href="/">
      <a>2022</a>
    </Link>
  </div>
)