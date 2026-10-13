import { useData } from '../context/DataContext'
import SeminarCard from '../components/SeminarCard'
import DashboardCard from '../components/DashboardCard'

export default function SeminarsPage() {
  const { seminars } = useData()
  return (
    <DashboardCard title="Seminars">
      <div className="grid grid-3">
        {seminars.map(sm => <SeminarCard key={sm.id} seminar={sm} />)}
      </div>
    </DashboardCard>
  )
}
