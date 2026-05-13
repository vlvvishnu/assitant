import { LockKeyhole, PlugZap } from 'lucide-react'
import { integrationRegistry } from '../services/integrations/registry'

export function IntegrationsPage() {
  return (
    <div className="space-y-3">
      <section className="card p-4"><PlugZap className="text-brand-500" /><h2 className="mt-3 text-2xl font-black">Integrations</h2><p className="text-sm text-slate-500">Plugin-based registry for Gmail, Slack, OCR, OpenAI, webhooks, uploads, and notes.</p></section>
      {Object.values(integrationRegistry).map((plugin) => (
        <article key={plugin.type} className="card p-4">
          <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{plugin.label}</h3><span className="pill">Configurable</span></div>
          <p className="mt-2 text-sm text-slate-500">{plugin.description}</p>
          {plugin.secureFields.length > 0 && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600"><LockKeyhole size={14} /> Secrets encrypted locally and mirrored encrypted in Supabase: {plugin.secureFields.join(', ')}</p>}
        </article>
      ))}
    </div>
  )
}
