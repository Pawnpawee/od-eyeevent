import { UsersIcon, EyeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'

interface StatsCardsProps {
  totalRegistrations: number
  pageViews: number
  mostPopularStore: string
}

interface CardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}

function Card({ label, value, icon }: CardProps) {
  return (
    <div className="bg-sand border border-stone p-6 flex items-start gap-4">
      <div className="text-drift mt-1">{icon}</div>
      <div>
        <p className="text-xs font-medium text-drift uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-4xl font-medium text-ink leading-none">{value}</p>
      </div>
    </div>
  )
}

export default function StatsCards({ totalRegistrations, pageViews, mostPopularStore }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        label="Total Registrations"
        value={totalRegistrations}
        icon={<UsersIcon className="w-5 h-5" />}
      />
      <Card
        label="Page Views"
        value={pageViews}
        icon={<EyeIcon className="w-5 h-5" />}
      />
      <Card
        label="Most Popular Store"
        value={mostPopularStore || '—'}
        icon={<BuildingStorefrontIcon className="w-5 h-5" />}
      />
    </div>
  )
}
