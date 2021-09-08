import { useMemo } from 'react'
import Link from 'next/link'

function getMonths() {
  const currentMonth = (new Date()).getMonth()
  const months = []
  for (let i = 3; i <= currentMonth && i <= 9; i++) {
    const date = new Date()
    date.setMonth(i)
    months.push(date.toLocaleString('default', { month: 'long' }))
  }
  return months
}

export default function MonthList() {
  const months = useMemo(getMonths, [])
  return (
    <nav>
      <Link href="/">
        <a>Full Season</a>
      </Link>
      {
        months.map(month => (
          <Link key={month} href={month.toLowerCase()}>
            <a>{month}</a>
          </Link>
        ))
      }
    </nav>
  )
}