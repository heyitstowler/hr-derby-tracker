import { useState } from 'react'
import Table from './Table'
import styles from './Team.module.css'

export default function Team({ name, score, roster }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={styles.team} onClick={() => setExpanded(expanded => !expanded)}>
      <Table headings={[name, score]} data={roster} expanded={expanded}/>
    </div>
  )
}
