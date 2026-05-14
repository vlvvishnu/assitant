import type { SharedAttachment, SharedPayload } from '../types/domain'

const fileFields = ['files', 'file', 'attachment', 'media']

function kindFor(file: File): SharedAttachment['kind'] {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf'
  return 'file'
}

function validate(file: File) {
  const accepted = file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  const maxBytes = 25 * 1024 * 1024
  if (!accepted) throw new Error(`${file.name} is not a supported image or PDF.`)
  if (file.size > maxBytes) throw new Error(`${file.name} exceeds the 25MB attachment limit.`)
}

export async function parseSharedPayload(formData?: FormData): Promise<SharedPayload> {
  const params = new URLSearchParams(window.location.search)
  const source: SharedPayload['source'] = formData ? 'web-share-target' : 'manual'
  const title = (formData?.get('title') ?? params.get('title') ?? undefined)?.toString()
  const text = (formData?.get('text') ?? params.get('text') ?? undefined)?.toString()
  const url = (formData?.get('url') ?? params.get('url') ?? undefined)?.toString()
  const attachments: SharedAttachment[] = []

  if (formData) {
    for (const field of fileFields) {
      for (const entry of formData.getAll(field)) {
        if (entry instanceof File && entry.size > 0) {
          validate(entry)
          attachments.push({
            id: crypto.randomUUID(),
            name: entry.name || `shared-${attachments.length + 1}`,
            type: entry.type || 'application/octet-stream',
            size: entry.size,
            kind: kindFor(entry),
            blob: entry,
            previewUrl: entry.type.startsWith('image/') ? URL.createObjectURL(entry) : undefined,
          })
        }
      }
    }
  }

  return {
    id: crypto.randomUUID(),
    title,
    text,
    url: url || (text?.startsWith('http') ? text : undefined),
    receivedAt: new Date().toISOString(),
    source,
    attachments,
    metadata: { userAgent: navigator.userAgent, online: navigator.onLine },
  }
}
