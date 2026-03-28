import { useMemo } from 'react'
import Link from 'next/link'

function getMonths(): string[] {
  const currentMonth = (new Date()).getMonth()
  const months: string[] = []
  for (let i = 3; i <= currentMonth && i <= 9; i++) {
    // weird timezone shenanigans
    const date = new Date('12/5/2026')
    date.setMonth(i)
    months.push(date.toLocaleString('en-US', { month: 'long' }))
  }
  return months
}

interface MonthListProps {
  year: number
}

export default function MonthList({ year }: MonthListProps) {
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
