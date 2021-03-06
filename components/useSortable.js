import { useState } from 'react';

export function useSortable(data) {
  const [sort, setSort] = useState({ by: 'hrs', asc: false})
  const list = sort.by === 'a-z'
    ? toSortedList(data, { asc: sort.asc })
    :toSortedList(data, { fn: byHomeRuns, asc: sort.asc })

  const { by, asc } = sort

  return {
    list, by, asc, setSort
  }
}

export function alphabeticalSort(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}

export function byHomeRuns(_a, _b) {
  const a = Number(_a[1])
  const b = Number(_b[1])
  if (a === b) {
    return 0;
  }
  else {
      return (a > b) ? -1 : 1;
  }
}

export function toSortedList(data, {fn = alphabeticalSort, asc = false}) {
  const list = Object.entries(data)
  list.sort(
    asc ? (a, b) => fn(b, a) : fn
  )
  return list
}