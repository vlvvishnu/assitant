import { Plus } from 'lucide-react'
import { WorkflowCard } from '../components/WorkflowCard'
import { defaultWorkflows } from '../services/workflows/defaults'
import { integrationRegistry } from '../services/integrations/registry'

export function WorkflowBuilderPage() {
  return (
    <div className="space-y-4">
      <section className="card p-4">
        <p className="pill w-fit">Trigger → Workflow → Actions</p>
        <h2 className="mt-3 text-2xl font-black">Workflow Builder</h2>
        <p className="mt-2 text-sm text-slate-500">A database-driven visual editor model. Add future actions by registering a plugin and storing action config in Supabase.</p>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 font-bold text-white"><Plus size={18} /> New workflow</button>
      </section>
      <section className="space-y-3">
        {defaultWorkflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)}
      </section>
      <section className="card p-4">
        <h3 className="font-bold">Available action plugins</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {Object.values(integrationRegistry).map((plugin) => <div key={plugin.type} className="rounded-2xl bg-slate-50 p-3"><b>{plugin.label}</b><p className="text-sm text-slate-500">{plugin.description}</p></div>)}
        </div>
      </section>
    </div>
  )
}
