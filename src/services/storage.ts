import { openDB, type DBSchema } from 'idb'
import type { SharedPayload } from '../types/domain'

export interface QueueItem {
  id: string
  workflowId: string
  payloadId: string
  createdAt: string
  attempts: number
  status: 'pending' | 'running' | 'failed'
  lastError?: string
}

interface FlowDb extends DBSchema {
  shares: { key: string; value: SharedPayload }
  queue: { key: string; value: QueueItem; indexes: { 'by-status': QueueItem['status'] } }
  secrets: { key: string; value: { id: string; ciphertext: string; updatedAt: string } }
}

const dbPromise = openDB<FlowDb>('flow-assistant', 1, {
  upgrade(db) {
    db.createObjectStore('shares', { keyPath: 'id' })
    const queue = db.createObjectStore('queue', { keyPath: 'id' })
    queue.createIndex('by-status', 'status')
    db.createObjectStore('secrets', { keyPath: 'id' })
  },
})

export async function saveShare(payload: SharedPayload) {
  const db = await dbPromise
  await db.put('shares', payload)
}

export async function getLatestShare() {
  const db = await dbPromise
  const shares = await db.getAll('shares')
  return shares.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0]
}

export async function listShares() {
  const db = await dbPromise
  return (await db.getAll('shares')).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
}

export async function enqueueWorkflow(workflowId: string, payloadId: string) {
  const db = await dbPromise
  const item: QueueItem = {
    id: crypto.randomUUID(),
    workflowId,
    payloadId,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending',
  }
  await db.put('queue', item)
  return item
}

export async function listQueue() {
  const db = await dbPromise
  return db.getAll('queue')
}

export async function storeEncryptedSecret(id: string, ciphertext: string) {
  const db = await dbPromise
  await db.put('secrets', { id, ciphertext, updatedAt: new Date().toISOString() })
}
