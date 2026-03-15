import { useState } from 'react'

type SortEntry = [string, string | number]
type SortConfig = { by: string; asc: boolean }
type SortOptions = {
  fn?: (a: SortEntry, b: SortEntry) => number
  asc?: boolean
}

export function useSortable(data: Record<string, string | number>) {
  const [sort, setSort] = useState<SortConfig>({ by: 'hrs', asc: false })
  const list = sort.by === 'a-z'
    ? toSortedList(data, { asc: sort.asc })
    : toSortedList(data, { fn: byHomeRuns, asc: sort.asc })

  const { by, asc } = sort

  return {
    list, by, asc, setSort
  }
}

export function alphabeticalSort(a: SortEntry, b: SortEntry): number {
  if (a[0] === b[0]) {
    return 0
  }
  return (a[0] < b[0]) ? -1 : 1
}

export function byHomeRuns(_a: SortEntry, _b: SortEntry): number {
  const a = Number(_a[1])
  const b = Number(_b[1])
  if (a === b) {
    return 0
  }
  return (a > b) ? -1 : 1
}

export function toSortedList(
  data: Record<string, string | number>,
  { fn = alphabeticalSort, asc = false }: SortOptions
): SortEntry[] {
  const list = Object.entries(data) as SortEntry[]
  list.sort(
    asc ? (a, b) => fn(b, a) : fn
  )
  return list
}
