import { getStore } from '@/lib/store'
import { NewRequestForm } from './NewRequestForm'

export default async function NewRequestPage() {
  const { teams } = await getStore().read()

  // First day of the month two calendar months from today.
  // Build the string from local date parts to avoid UTC conversion shifting the day.
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + 2, 1)
  const defaultDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`

  return <NewRequestForm teams={teams} defaultDate={defaultDate} />
}
