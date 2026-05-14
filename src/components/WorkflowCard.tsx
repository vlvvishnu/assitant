import { ArrowDown, Play } from 'lucide-react'
import type { WorkflowDefinition } from '../types/domain'

export function WorkflowCard({ workflow, onRun }: { workflow: WorkflowDefinition; onRun?: () => void }) {
  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="pill w-fit">WHEN: {workflow.trigger.replace('_', ' ')}</p>
          <h3 className="mt-3 text-lg font-bold text-slate-950">{workflow.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{workflow.description}</p>
        </div>
        {onRun && <button onClick={onRun} className="rounded-full bg-ink p-3 text-white"><Play size={18} /></button>}
      </div>
      <div className="mt-4 space-y-2">
        {workflow.actions.sort((a, b) => a.position - b.position).map((action, index) => (
          <div key={action.id} className="flex items-center gap-2">
            {index > 0 && <ArrowDown size={14} className="text-slate-400" />}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">THEN: {action.label}</div>
          </div>
        ))}
      </div>
    </article>
  )
}
