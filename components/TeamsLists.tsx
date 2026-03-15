import Team from './Team'
import { byHomeRuns, useSortable } from './useSortable'
import styles from './SortableTable.module.css'
import { SortButton } from './SortableTable'
import type { Teams, HRData, RosterEntry } from '../types'

const format = (teams: Teams, stats: HRData) => {
  const ts = Object.keys(teams)
  const map: Record<string, number> = {}
  const rosters: Record<string, RosterEntry[]> = {}

  ts.forEach(t => {
    let total = 0
    rosters[t] = []
    teams[t].forEach(p => {
      const pscore = parseInt(String(stats[p] ?? '0'), 10)
      rosters[t].push([p, pscore])
      total += pscore
    })
    map[t] = total
    rosters[t].sort(byHomeRuns)
  })
  return { teamScores: map, rosters }
}

interface TeamsListsProps {
  teams: Teams
  stats: HRData
}

export default function TeamsLists({ teams, stats }: TeamsListsProps) {
  const { teamScores, rosters } = format(teams, stats)
  const { list, by, asc, setSort } = useSortable(teamScores)
  return (
    <section>
      <section className={styles.buttons}>
        <SortButton active={by === 'hrs' && !asc} sort={setSort} by="hrs" >Total (desc)</SortButton>
        <SortButton active={by === 'hrs' && asc} sort={setSort} by="hrs" asc>Total (asc)</SortButton>
        <SortButton active={by === 'a-z' && !asc} sort={setSort} by="a-z">A - Z</SortButton>
        <SortButton active={by === 'a-z' && asc} sort={setSort} by="a-z" asc>Z - A</SortButton>
      </section>
      {
        list.map(([name, score]) => (
          <Team key={name} name={name} score={Number(score)} roster={rosters[name] ?? []} />
        ))
      }
    </section>
  )
}
