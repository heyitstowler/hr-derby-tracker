import { type ReactNode, type Dispatch, type SetStateAction } from 'react'
import { useSortable } from './useSortable'
import styles from './SortableTable.module.css'
import Table from './Table'

interface SortableTableProps {
  className?: string
  headings: string[]
  data: Record<string, string | number>
}

interface SortButtonProps {
  children: ReactNode
  sort: Dispatch<SetStateAction<{ by: string; asc: boolean }>>
  by: string
  asc?: boolean
  active: boolean
}

export default function SortableTable({ className = '', headings, data }: SortableTableProps) {
  const { list: hrList, by, asc, setSort } = useSortable(data)
  return (
    <section className={className}>
      <section className={styles.buttons}>
        <SortButton active={by === 'hrs' && !asc} sort={setSort} by="hrs" >HRs (desc)</SortButton>
        <SortButton active={by === 'hrs' && asc} sort={setSort} by="hrs" asc>HRs (asc)</SortButton>
        <SortButton active={by === 'a-z' && !asc} sort={setSort} by="a-z">A - Z</SortButton>
        <SortButton active={by === 'a-z' && asc} sort={setSort} by="a-z" asc>Z - A</SortButton>
      </section>
      <Table
        headings={headings}
        data={hrList}
      />
    </section>
  )
}

export function SortButton({ children, sort, by, asc = false, active }: SortButtonProps) {
  const getSort = (by: string, asc = false) => () => sort({ by, asc })

  return (
    <button
      className={`${styles['sort-button']} ${active ? styles.active : ''}`}
      onClick={getSort(by, asc)}
      >
        {children}
    </button>
  )
}
