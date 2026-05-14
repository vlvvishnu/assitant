import type { SharedAttachment } from '../types/domain'

export async function extractText(attachment: SharedAttachment) {
  if (attachment.kind === 'pdf') {
    return 'PDF OCR is queued for server-side rendering or a future pdf.js rasterization adapter before Tesseract processing.'
  }

  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  try {
    const result = await worker.recognize(attachment.blob)
    return result.data.text.trim()
  } finally {
    await worker.terminate()
  }
}
