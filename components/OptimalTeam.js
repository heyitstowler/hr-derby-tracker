import Team from './Team'

export default function OptimalTeam({ optimal }) {
  return <Team name="Captain Hindsight" score={optimal.score} roster={optimal.roster} />
}
