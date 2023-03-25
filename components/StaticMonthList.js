import Link from 'next/link'

export default function MonthList({ year }) {
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
      <Link legacyBehavior href="/2021">
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
