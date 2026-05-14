import { Smartphone, ShieldCheck } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-4">
      <section className="card p-4"><Smartphone className="text-brand-500" /><h2 className="mt-3 text-2xl font-black">Install on Android</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600"><li>Open the app in Chrome.</li><li>Tap the browser menu.</li><li>Choose Add to Home Screen or Install app.</li><li>Share from WhatsApp, Gallery, Chrome, Gmail, or Files to Flow Assistant.</li></ol></section>
      <section className="card p-4"><ShieldCheck className="text-emerald-500" /><h3 className="mt-3 font-bold">Security posture</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600"><li>Attachment validation limits accepted files to images and PDFs under 25MB.</li><li>Secrets are encrypted with Web Crypto before local storage or database persistence.</li><li>Supabase Row Level Security policies scope data to authenticated users.</li></ul></section>
      <section className="card p-4"><h3 className="font-bold">Future-ready modules</h3><p className="mt-2 text-sm text-slate-500">The app shell is ready for Capacitor wrapping, overlay assistants, voice commands, background uploads, and push notifications.</p></section>
    </div>
  )
}
