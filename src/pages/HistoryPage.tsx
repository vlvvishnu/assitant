import { useEffect, useState } from 'react'
import { listQueue, listShares, type QueueItem } from '../services/storage'
import type { SharedPayload } from '../types/domain'

export function HistoryPage() {
  const [shares, setShares] = useState<SharedPayload[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  useEffect(() => { listShares().then(setShares); listQueue().then(setQueue) }, [])
  return (
    <div className="space-y-4">
      <section className="card p-4"><h2 className="text-2xl font-black">Activity History</h2><p className="text-sm text-slate-500">Local cache and offline retry queue.</p></section>
      <section className="card p-4"><h3 className="font-bold">Offline Queue</h3>{queue.length === 0 ? <p className="mt-2 text-sm text-slate-500">No queued workflow runs.</p> : queue.map((item) => <p key={item.id} className="mt-2 text-sm">{item.workflowId} · {item.status} · attempts {item.attempts}</p>)}</section>
      {shares.map((share) => <article key={share.id} className="card p-4"><b>{share.title || share.text || share.url || 'Shared attachments'}</b><p className="text-sm text-slate-500">{new Date(share.receivedAt).toLocaleString()} · {share.attachments.length} attachment(s)</p></article>)}
    </div>
  )
}
