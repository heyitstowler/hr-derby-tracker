export type HRData = Record<string, string | number>

export type RosterEntry = [string, number]

export interface OptimalTeam {
  score: number
  roster: RosterEntry[]
  error?: string
}

export type Teams = Record<string, string[]>

export interface PlayerWithCost {
  Name: string
  cost: string | number
}
