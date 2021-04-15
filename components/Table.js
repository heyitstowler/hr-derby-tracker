import React from 'react'
import styles from './Table.module.css'

export default function Table({ headings, data, expanded = true }) {
  return (
    <table className={styles.t}>
      <thead className={styles.thead}>
        <tr className={styles.tr}>
         { headings.map(h => (
           <td key={h}>{h}</td>
         ))}
        </tr>
      </thead>
      { expanded && (
        <tbody>
          {
            data.map((row, idx) => (
              <tr className={styles.tr} key={idx}>
                { row.map(r => <td key={r}>{r}</td>)}
              </tr>
            ))
          }
        </tbody>
      )}
    </table>
  )
}
