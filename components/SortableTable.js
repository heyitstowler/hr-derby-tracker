import { useSortable } from './useSortable'
import styles from './SortableTable.module.css'
import Table from './Table';

export default function SortableTable({ className = '', headings, data }) {
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


export function SortButton({ children, sort, by, asc = false, active }) {
  const getSort = (by, asc = false) => () => sort({ by, asc })

  return (
    <button
      className={`${styles['sort-button']} ${active ? styles.active : ''}`}
      onClick={getSort(by, asc)}
      >
        {children}
    </button>
  )
}
