import type { ReactNode } from 'react'
import styles from './Table.module.css'

interface TableProps {
  headings: (string | number)[]
  data: ReactNode[][]
  expanded?: boolean
  sortKeys?: (string | null)[]
  sort?: { by: string; asc: boolean }
  onSort?: (by: string, asc: boolean) => void
}

export default function Table({ headings, data, expanded = true, sortKeys, sort, onSort }: TableProps) {
  return (
    <table className={styles.t}>
      <thead className={styles.thead}>
        <tr className={styles.tr}>
          {headings.map((h, i) => {
            const sortKey = sortKeys?.[i]
            return (
              <td key={i}>
                <span className={`${styles.th} heading-${i}`}>
                  {h}
                  {sortKey && onSort && (
                    <span className={styles.arrows}>
                      <button
                        className={`${styles.arrow} ${sort?.by === sortKey && sort.asc ? styles.arrowActive : ''}`}
                        onClick={() => onSort(sortKey, true)}
                      >▲</button>
                      <button
                        className={`${styles.arrow} ${sort?.by === sortKey && !sort.asc ? styles.arrowActive : ''}`}
                        onClick={() => onSort(sortKey, false)}
                      >▼</button>
                    </span>
                  )}
                </span>
              </td>
            )
          })}
        </tr>
      </thead>
      { expanded && (
        <tbody>
          {
            data.map((row, idx) => (
              <tr className={styles.tr} key={idx}>
                { row.map((r, i) => <td key={i}>{r}</td>)}
              </tr>
            ))
          }
        </tbody>
      )}
    </table>
  )
}
