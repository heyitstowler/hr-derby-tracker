import SortableTable from './SortableTable';
import TeamsLists from './TeamsLists';
import TEAMS from '../constants/teams';
import styles from '../styles/Home.module.css'

export default function Stats({ hrs }) {
  return (
    <>
      <section className={styles.mobile}>
        <a href="#standings">Standings</a>
        <a href="#player-stats">Player Stats</a>
      </section>
      <section id="standings">
        <h2>Standings</h2>
        <TeamsLists teams={TEAMS} stats={hrs} />
      </section>
      <section id="player-stats">
        <h2>Player Stats</h2>
        <SortableTable headings={['Player', 'HRs']} data={hrs} />
      </section>
    </>
  )
}