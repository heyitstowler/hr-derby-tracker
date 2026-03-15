import Team from './Team'
import type { OptimalTeam as OptimalTeamData } from '../types'

interface OptimalTeamProps {
  optimal: OptimalTeamData
}

export default function OptimalTeam({ optimal }: OptimalTeamProps) {
  return <Team name="Captain Hindsight" score={optimal.score} roster={optimal.roster} />
}
