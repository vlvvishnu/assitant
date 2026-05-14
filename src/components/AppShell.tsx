import { NavLink, Outlet } from 'react-router-dom'
import { Home, History, Plug, Settings, Share2, Shapes, Wand2 } from 'lucide-react'

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/share', label: 'Share', icon: Share2 },
  { to: '/workflows', label: 'Flows', icon: Wand2 },
  { to: '/integrations', label: 'Apps', icon: Plug },
  { to: '/templates', label: 'Templates', icon: Shapes },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-50 md:max-w-5xl">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-ink px-5 pb-4 pt-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-50/70">Flow Assistant</p>
        <h1 className="mt-2 text-2xl font-bold">Android workflow command center</h1>
      </header>
      <main className="flex-1 px-4 py-5 md:px-8"><Outlet /></main>
      <nav className="safe-bottom sticky bottom-0 z-20 grid grid-cols-7 gap-1 border-t border-slate-200 bg-white/95 px-2 pt-2 backdrop-blur">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center rounded-2xl px-1 py-2 text-[10px] font-semibold ${isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-500'}`}>
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
