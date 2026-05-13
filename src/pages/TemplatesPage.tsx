import { defaultTemplates } from '../services/templates'

export function TemplatesPage() {
  return (
    <div className="space-y-3">
      <section className="card p-4"><p className="pill w-fit">Variables: {'{{filename}} {{summary}} {{date}} {{extracted_text}}'}</p><h2 className="mt-3 text-2xl font-black">Templates</h2><p className="text-sm text-slate-500">Reusable email, Slack, workflow, and AI prompt templates.</p></section>
      {defaultTemplates.map((template) => <article key={template.id} className="card p-4"><div className="flex justify-between gap-2"><h3 className="font-bold">{template.name}</h3><span className="pill">{template.type}</span></div>{template.subject && <p className="mt-2 text-sm font-semibold">{template.subject}</p>}<pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">{template.body}</pre></article>)}
    </div>
  )
}
