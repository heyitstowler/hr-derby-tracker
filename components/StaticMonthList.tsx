import Link from 'next/link'

interface StaticMonthListProps {
  year: number
}

export default function StaticMonthList({ year }: StaticMonthListProps) {
  const months = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
  ]
  return (
    <nav>
      <Link legacyBehavior href={`/${year}`}>
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
