import { getStore } from '@/lib/store'
import { currentUser } from '@/lib/person'
import { copy } from '@/lib/copy'
import { ApprovalCard } from '@/components/ApprovalCard'

export default async function KeSchvaleniPage() {
  const user  = await currentUser()
  const store = await getStore().read()

  // Only hrbp (Petra) has items to approve
  const pending = user.role === 'hrbp'
    ? store.requests.filter(r =>
        r.approval?.approverId === user.id &&
        r.approval?.decision   === 'pending'
      )
    : []

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink mb-8">
        {copy.approvalsPage.title}
      </h1>

      {pending.length === 0 ? (
        <p className="text-[12.5px] text-muted">{copy.approvalsPage.empty}</p>
      ) : (
        <div className="space-y-8">
          {pending.map(request => {
            const requester = store.users.find(u => u.id === request.requesterId)
            if (!requester) return null
            return (
              <div key={request.id}>
                <p className="text-[12.5px] text-ink mb-4">
                  {copy.approvalCard.leadLine(requester.nameGenitive, requester.titleGenitive)}
                </p>
                <ApprovalCard request={request} requester={requester} />
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
