import { useState } from 'react'
import type { CombinedData, PlayerData } from '../types'

// SortEntry kept for byHomeRuns / toSortedList used in knapsack.ts and TeamsLists.tsx
export type SortEntry = [string, string | number]
type SortConfig = { by: string; asc: boolean }
type SortOptions = {
  fn?: (a: SortEntry, b: SortEntry) => number
  asc?: boolean
}

export function useSortable(data: CombinedData) {
  const [sort, setSort] = useState<SortConfig>({ by: 'hrs', asc: false })

  const list: PlayerData[] = Object.values(data).sort((a, b) => {
    const dir = sort.asc ? 1 : -1
    switch (sort.by) {
      case 'hrs':   return dir * (a.hrs - b.hrs)
      case 'picks': return dir * ((a.picks ?? 0) - (b.picks ?? 0))
      case 'value': return dir * ((a.value ?? 0) - (b.value ?? 0))
      case 'a-z':   return dir * a.name.localeCompare(b.name)
      default:      return 0
    }
  })

  return { list, by: sort.by, asc: sort.asc, setSort }
}

export function alphabeticalSort(a: SortEntry, b: SortEntry): number {
  if (a[0] === b[0]) return 0
  return (a[0] < b[0]) ? -1 : 1
}

export function byHomeRuns(_a: SortEntry, _b: SortEntry): number {
  const a = Number(_a[1])
  const b = Number(_b[1])
  if (a === b) return 0
  return (a > b) ? -1 : 1
}

export function toSortedList(
  data: Record<string, string | number>,
  { fn = alphabeticalSort, asc = false }: SortOptions
): SortEntry[] {
  const list = Object.entries(data) as SortEntry[]
  list.sort(asc ? (a, b) => fn(b, a) : fn)
  return list
}
