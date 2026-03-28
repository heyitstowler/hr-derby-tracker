import { useState } from 'react'
import Table from './Table'
import styles from './Team.module.css'
import type { RosterEntry } from '../types'

interface TeamProps {
  name: string
  score: number
  roster: RosterEntry[]
}

function rvColor(rv: number): string {
  const t = Math.max(0, Math.min(1, (rv - 0.5) / 0.5))
  const r = Math.round(210 - t * 170)
  const g = Math.round(40 + t * 150)
  return `rgb(${r}, ${g}, 40)`
}

function PlayerCell({ name, rv }: { name: string; rv?: string | number }) {
  if (rv == null) return <>{name}</>
  const rvNum = Number(rv)
  if (rvNum >= 1.0) {
    return (
      <>
        <span className={styles.star} title="RV: 1.00">★</span>
        {name}
      </>
    )
  }
  return (
    <>
      <span
        className={styles.dot}
        style={{ background: rvColor(rvNum) }}
        title={`RV: ${rvNum.toFixed(2)}`}
      />
      {name}
    </>
  )
}

export default function Team({ name, score, roster }: TeamProps) {
  const [expanded, setExpanded] = useState(false)
  const tableData = roster.map(([playerName, hrs, rv]) => [
    <PlayerCell key={playerName} name={playerName} rv={rv} />,
    hrs,
  ])
  return (
    <div className={styles.team} onClick={() => setExpanded(e => !e)}>
      <Table headings={[name, score]} data={tableData} expanded={expanded} />
    </div>
  )
}
