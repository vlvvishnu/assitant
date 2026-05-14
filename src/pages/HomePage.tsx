import { Link } from 'react-router-dom'
import { Bot, Share2, WifiOff, Zap } from 'lucide-react'
import { defaultWorkflows } from '../services/workflows/defaults'
import { WorkflowCard } from '../components/WorkflowCard'

export function HomePage() {
  return (
    <div className="space-y-5">
      <section className="card overflow-hidden bg-gradient-to-br from-ink to-brand-900 p-5 text-white">
        <Bot className="mb-5 text-brand-50" size={34} />
        <h2 className="text-3xl font-black leading-tight">Share from WhatsApp, Gallery, Chrome, Gmail, or Files.</h2>
        <p className="mt-3 text-sm text-slate-200">Flow Assistant receives text, links, images, and PDFs on Android, caches them offline, then runs configurable workflows.</p>
        <Link to="/share" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-ink"><Share2 size={18} /> Open share inbox</Link>
      </section>
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white p-4 text-center shadow-soft"><Zap className="mx-auto text-brand-500" /><b>{defaultWorkflows.length}</b><p className="text-xs text-slate-500">Flows</p></div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-soft"><Share2 className="mx-auto text-brand-500" /><b>4</b><p className="text-xs text-slate-500">Types</p></div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-soft"><WifiOff className="mx-auto text-brand-500" /><b>Offline</b><p className="text-xs text-slate-500">Queue</p></div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Starter workflows</h2>
        {defaultWorkflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)}
      </section>
    </div>
  )
}
