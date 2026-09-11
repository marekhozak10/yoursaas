import { notFound } from 'next/navigation'
import { getStore } from '@/lib/store'
import { currentUser } from '@/lib/person'
import { DetailLive } from './DetailLive'

export default async function PozadavekDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const store = await getStore().read()
  const request = store.requests.find(r => r.id === id)

  if (!request) notFound()

  const user = await currentUser()

  return (
    <DetailLive
      initialRequest={request}
      user={user}
      users={store.users}
      teams={store.teams}
    />
  )
}
