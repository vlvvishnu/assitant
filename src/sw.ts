/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { openDB } from 'idb'
import type { SharedAttachment, SharedPayload } from './types/domain'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

async function saveShare(payload: SharedPayload) {
  const db = await openDB('flow-assistant', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('shares')) database.createObjectStore('shares', { keyPath: 'id' })
      if (!database.objectStoreNames.contains('queue')) {
        const queue = database.createObjectStore('queue', { keyPath: 'id' })
        queue.createIndex('by-status', 'status')
      }
      if (!database.objectStoreNames.contains('secrets')) database.createObjectStore('secrets', { keyPath: 'id' })
    },
  })
  await db.put('shares', payload)
}

function attachmentFromFile(file: File, index: number): SharedAttachment {
  const kind = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'file'
  return { id: crypto.randomUUID(), name: file.name || `shared-${index + 1}`, type: file.type || 'application/octet-stream', size: file.size, kind, blob: file }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method === 'POST' && url.pathname === '/share') {
    event.respondWith((async () => {
      const formData = await event.request.formData()
      const attachments: SharedAttachment[] = []
      for (const field of ['files', 'file', 'attachment', 'media']) {
        for (const entry of formData.getAll(field)) {
          if (entry instanceof File && entry.size > 0) attachments.push(attachmentFromFile(entry, attachments.length))
        }
      }
      const text = formData.get('text')?.toString()
      const payload: SharedPayload = {
        id: crypto.randomUUID(),
        title: formData.get('title')?.toString(),
        text,
        url: formData.get('url')?.toString() || (text?.startsWith('http') ? text : undefined),
        receivedAt: new Date().toISOString(),
        source: 'web-share-target',
        attachments,
        metadata: { acceptedBy: 'service-worker-share-target' },
      }
      await saveShare(payload)
      return Response.redirect(new URL('/share?shared=1', self.location.origin).toString(), 303)
    })())
  }
})

registerRoute(({ url }) => url.hostname.endsWith('.supabase.co'), new NetworkFirst({ cacheName: 'supabase-api' }))
registerRoute(({ request }) => ['document', 'script', 'style', 'image', 'font'].includes(request.destination), new StaleWhileRevalidate({ cacheName: 'flow-static' }))
