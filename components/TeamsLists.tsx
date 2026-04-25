import { useState } from 'react'
import Team from './Team'
import { byHomeRuns, alphabeticalSort, toSortedList } from './useSortable'
import tableStyles from './Table.module.css'
import styles from './TeamsLists.module.css'
import type { Teams, HRData, RosterEntry } from '../types'
import type { DraftEntry } from '../constants/draftData2026'

const format = (teams: Teams, stats: HRData, draftData?: Record<string, DraftEntry>) => {
  const ts = Object.keys(teams)
  const map: Record<string, number> = {}
  const rosters: Record<string, RosterEntry[]> = {}

  ts.forEach(t => {
    let total = 0
    rosters[t] = []
    teams[t].forEach(p => {
      const pscore = parseInt(String(stats[p] ?? '0'), 10)
      const value = draftData?.[p]?.value
      rosters[t].push(value != null ? [p, pscore, value] : [p, pscore])
      total += pscore
    })
    map[t] = total
    rosters[t].sort(byHomeRuns as (a: RosterEntry, b: RosterEntry) => number)
  })
  return { teamScores: map, rosters }
}

interface TeamsListsProps {
  teams: Teams
  stats: HRData
  draftData?: Record<string, DraftEntry>
}

export default function TeamsLists({ teams, stats, draftData }: TeamsListsProps) {
  const { teamScores, rosters } = format(teams, stats, draftData)
  const [sort, setSort] = useState<{ by: string; asc: boolean }>({ by: 'hrs', asc: false })
  const { by, asc } = sort
  const list = toSortedList(teamScores, { fn: by === 'a-z' ? alphabeticalSort : byHomeRuns, asc })

  const arrow = (col: string, colAsc: boolean) => (
    <button
      className={`${tableStyles.arrow} ${by === col && asc === colAsc ? tableStyles.arrowActive : ''}`}
      onClick={() => setSort({ by: col, asc: colAsc })}
    >
      {colAsc ? '▲' : '▼'}
    </button>
  )

  const maxScore = Math.max(...Object.values(teamScores))
  const firstPlaceNames: Record<string, string> = {
    'Dave Trompeter': "Dave 'Cheated' Trompeter",
    'Kevin Towler': 'Capt. Kevin of the 4th Astro Alliance',
    'Collin Stiles': "Collin 'Read Good' Stiles",
    'Dan Pasacrita': "Dan 'The Man' Pasacrita",
    'Chris Towler': 'nnngggGGEEET WREEECKKKEEEDD',
    'Keith McLoat Jr.': 'Keith McGOAT Jr.',
    'Harrison Uzwy': "Harrison 'No Hands' Uzwy",
    'Pedy': 'Pedy the MEATY',
    'Stephen Burns': "Stephen 'Boo-urns' Burns",
  }

  const displayName = (name: string) => {
    if (teamScores[name] === maxScore) {
      for (const [key, val] of Object.entries(firstPlaceNames)) {
        if (name.startsWith(key)) return name.replace(key, val)
      }
    }
    return name
  }

  return (
    <section>
      <div className={styles.header}>
        <span className={styles.col}>
          Team
          <span className={tableStyles.arrows}>{arrow('a-z', true)}{arrow('a-z', false)}</span>
        </span>
        <span className={styles.col}>
          Total
          <span className={tableStyles.arrows}>{arrow('hrs', true)}{arrow('hrs', false)}</span>
        </span>
      </div>
      {list.map(([name, score]) => (
        <Team key={name} name={displayName(name)} score={Number(score)} roster={rosters[name] ?? []} />
      ))}
    </section>
  )
}
