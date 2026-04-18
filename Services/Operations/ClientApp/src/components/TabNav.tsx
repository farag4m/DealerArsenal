import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

interface TabItem {
  to: string
  label: string
}

interface TabNavProps {
  tabs: TabItem[]
}

export default function TabNav({ tabs }: TabNavProps): React.JSX.Element {
  return (
    <nav
      className="flex border-b border-gray-200 bg-white"
      aria-label="Operations tabs"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }: { isActive: boolean }) =>
            clsx(
              'px-6 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'border-b-2 border-brand-600 text-brand-700'
                : 'text-gray-500 hover:text-gray-700',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
