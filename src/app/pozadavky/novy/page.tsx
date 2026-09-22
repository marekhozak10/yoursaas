import { getStore } from '@/lib/store'
import { NewRequestForm } from './NewRequestForm'
import { copy } from '@/lib/copy'

export default async function NewRequestPage() {
  const { teams } = await getStore().read()

  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + 2, 1)
  const defaultDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`

  return (
    <div id="embed-root" className="min-h-[calc(100vh-56px)] bg-canvas">
      {/* Hidden checkbox — toggled by the label below */}
      <input type="checkbox" id="embed-toggle" className="sr-only" />

      <NewRequestForm teams={teams} defaultDate={defaultDate} />

      {/* Toggle label — acts as a button, no JS needed */}
      <label
        htmlFor="embed-toggle"
        className="embed-toggle-btn fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold cursor-pointer shadow-raised"
        style={{ transition: 'background 0.15s, color 0.15s, border-color 0.15s' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/appmixer-logo.png" alt="" width={14} height={14} style={{ flexShrink: 0, objectFit: 'contain' }} />
        <span className="embed-show-text">{copy.appmixerHighlight.toggleShow}</span>
        <span className="embed-hide-text">{copy.appmixerHighlight.toggleHide}</span>
      </label>
    </div>
  )
}
