import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { SharePage } from './pages/SharePage'
import { WorkflowBuilderPage } from './pages/WorkflowBuilderPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'share', element: <SharePage /> },
      { path: 'workflows', element: <WorkflowBuilderPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
