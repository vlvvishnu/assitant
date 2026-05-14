import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Loader2, Play, Upload } from 'lucide-react'
import { AttachmentPreview } from '../components/AttachmentPreview'
import { parseSharedPayload } from '../services/shareTarget'
import { getLatestShare, saveShare } from '../services/storage'
import { defaultWorkflows } from '../services/workflows/defaults'
import { findMatchingWorkflows, runWorkflow, type WorkflowRunResult } from '../services/workflows/engine'
import type { SharedPayload } from '../types/domain'

export function SharePage() {
  const [payload, setPayload] = useState<SharedPayload>()
  const [status, setStatus] = useState('Ready to receive Android shares.')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<WorkflowRunResult[]>([])

  useEffect(() => {
    async function loadShare() {
      try {
        let shared: SharedPayload | undefined
        if (window.location.search || document.referrer) shared = await parseSharedPayload()
        shared ??= await getLatestShare()
        if (shared) setPayload(shared)
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Unable to load shared content.')
      }
    }
    loadShare()
  }, [])

  async function onPick(files: FileList | null) {
    if (!files?.length) return
    const data = new FormData()
    Array.from(files).forEach((file) => data.append('files', file))
    const shared = await parseSharedPayload(data)
    await saveShare(shared)
    setPayload(shared)
    setStatus('Saved locally. Choose a workflow to continue.')
  }

  async function runMatches() {
    if (!payload) return
    setRunning(true)
    await saveShare(payload)
    const matches = findMatchingWorkflows(defaultWorkflows, payload)
    const output: WorkflowRunResult[] = []
    for (const workflow of matches) output.push(await runWorkflow(workflow, payload))
    setResults(output)
    setStatus(output.length ? 'Workflow run complete.' : 'No matching workflow found. Create one in Builder.')
    setRunning(false)
  }

  const matches = useMemo(() => (payload ? findMatchingWorkflows(defaultWorkflows, payload) : []), [payload])

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <p className="pill w-fit">Android Web Share Target</p>
        <h2 className="mt-3 text-2xl font-black">Share Preview</h2>
        <p className="mt-1 text-sm text-slate-500">Supports text/plain, URLs, image/*, application/pdf, and multiple attachments.</p>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-500 bg-brand-50 p-5 font-bold text-brand-600">
          <Upload size={18} /> Add files manually
          <input className="hidden" type="file" multiple accept="image/*,application/pdf" onChange={(event) => onPick(event.target.files)} />
        </label>
      </section>
      {payload && <section className="space-y-3">
        {(payload.title || payload.text || payload.url) && <div className="card p-4"><h3 className="font-bold">Shared content</h3><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{payload.title || payload.text || payload.url}</p></div>}
        {payload.attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
        <button disabled={running} onClick={runMatches} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-4 font-bold text-white disabled:opacity-60">{running ? <Loader2 className="animate-spin" /> : <Play />} Run {matches.length} matching workflow(s)</button>
      </section>}
      <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">{status}</p>
      {results.map((run) => <section key={run.workflow.id} className="card p-4"><h3 className="font-bold">{run.workflow.name}</h3>{run.actionResults.map((result, index) => <p key={index} className="mt-2 flex gap-2 text-sm text-slate-600"><CheckCircle2 className="text-emerald-500" size={18} />{result.message}</p>)}</section>)}
    </div>
  )
}
