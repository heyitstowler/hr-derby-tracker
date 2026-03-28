import { useMemo } from 'react'
import { useSortable } from './useSortable'
import Table from './Table'
import type { CombinedData } from '../types'

interface SortableTableProps {
  className?: string
  headings: string[]
  data: CombinedData
  totalTeams?: number
}

const headingToSortKey: Record<string, string> = {
  'Player': 'a-z',
  'HRs': 'hrs',
  'Pks': 'picks',
  'RV': 'value',
}

export default function SortableTable({ className = '', headings, data, totalTeams }: SortableTableProps) {
  const { list, by, asc, setSort } = useSortable(data)

  const hasDraft = Object.values(data).some(p => p.picks != null)

  const tableData = useMemo(() =>
    list.map(p => {
      if (!hasDraft) return [p.name, p.hrs]
      const picks = p.picks || '0'
      const value = p.value != null ? p.value.toFixed(2) : '—'
      return [p.name, p.hrs, picks, value]
    }),
    [list, hasDraft, totalTeams]
  )

  const sortKeys = headings.map(h => headingToSortKey[h] ?? null)

  return (
    <section className={className}>
      <Table
        headings={headings}
        data={tableData}
        sortKeys={sortKeys}
        sort={{ by, asc }}
        onSort={(sortBy, sortAsc) => setSort({ by: sortBy, asc: sortAsc })}
      />
    </section>
  )
}
