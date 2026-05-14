declare module 'virtual:pwa-register' {
  export function registerSW(options?: { immediate?: boolean; onNeedRefresh?: () => void; onOfflineReady?: () => void }): (reloadPage?: boolean) => Promise<void>
}

type WorkboxPrecacheEntry = {
  integrity?: string
  url: string
  revision?: string | null
}

interface ServiceWorkerGlobalScope {
  __WB_MANIFEST: Array<WorkboxPrecacheEntry | string>
}
