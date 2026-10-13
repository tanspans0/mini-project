import { useData } from '../context/DataContext'
import EventCard from '../components/EventCard'
import DashboardCard from '../components/DashboardCard'

export default function EventsPage() {
  const { events } = useData()
  return (
    <DashboardCard title="Upcoming Events">
      <div className="grid grid-3">
        {events.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </DashboardCard>
  )
}
