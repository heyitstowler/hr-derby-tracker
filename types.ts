import { DraftEntry } from "./constants/draftData2026";


export type PlayerData = {
  name: string;
  hrs: number;
  picks?: number;
  value?: number;
}

export type HRData = Record<string, number>

export type CombinedData = Record<string, PlayerData>

export type RosterEntry = [string, number, (string | number)?]

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

export function formatTableData(hrData: HRData, draftData?: Record<string, DraftEntry>): CombinedData {
  const playerList: PlayerData[] = Object.entries(hrData).map(([name, hrs]) => ({
    name,
    hrs
  }))
  return playerList.reduce(((data, { name, hrs }) => {
    if (!draftData || !draftData[name]) {
      data[name] = {
        name,
        hrs,
      }
    } else {
      const { value, picks } = draftData[name]
      data[name] = {
        name,
        hrs,
        value,
        picks
      }
    }
    return data
  }), {} as CombinedData)
}