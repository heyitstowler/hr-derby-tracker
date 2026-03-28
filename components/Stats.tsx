import SortableTable from './SortableTable'
import TeamsLists from './TeamsLists'
import OptimalTeam from './OptimalTeam'
import styles from '../styles/Home.module.css'
import { formatTableData, type HRData, type OptimalTeam as OptimalTeamData, type Teams } from '../types'
import type { DraftEntry } from '../constants/draftData2026'

interface StatsProps {
  hrs: HRData
  teams: Teams
  optimal?: OptimalTeamData | null
  draftData?: Record<string, DraftEntry>
  totalTeams?: number
}

export default function Stats({ hrs, teams, optimal, draftData, totalTeams }: StatsProps) {
  const tableData = formatTableData(hrs, draftData)
  const headings = draftData ? ['Player', 'HRs', 'Pks', 'RV'] : ['Player', 'HRs']

  return (
    <>
      <section className={styles.mobile}>
        <a href="#standings">Standings</a>
        <a href="#player-stats">Player Stats</a>
      </section>
      <section id="standings">
        <h2>Standings</h2>
        { optimal && <OptimalTeam optimal={optimal} />}
        <TeamsLists teams={teams} stats={hrs} draftData={draftData} />
      </section>
      <section id="player-stats">
        <h2>Player Stats</h2>
        <SortableTable headings={headings} data={tableData} totalTeams={totalTeams} />
      </section>
    </>
  )
}
