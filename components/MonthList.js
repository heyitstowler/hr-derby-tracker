import { useMemo } from 'react'
import Link from 'next/link'

function getMonths() {
  const currentMonth = (new Date()).getMonth()
  const months = []
  for (let i = 3; i <= currentMonth && i <= 9; i++) {
    // wierd timezone shenanigans
    const date = new Date('12/5/2022')
    date.setMonth(i)
    months.push(date.toLocaleString('en-US', { month: 'long' }))
  }
  return months
}

export default function MonthList({ year }) {
  const months = useMemo(getMonths, [])
  return (
    <nav>
      <Link href="/" legacyBehavior>
        <a>Full Season</a>
      </Link>
      {
        months.map(month => (
          <Link legacyBehavior key={month} href={`/${year}/${month.toLowerCase()}`}>
            <a>{month}</a>
          </Link>
        ))
      }
    </nav>
  )
}
