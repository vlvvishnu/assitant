import { FileText, Image as ImageIcon } from 'lucide-react'
import type { SharedAttachment } from '../types/domain'

export function AttachmentPreview({ attachment }: { attachment: SharedAttachment }) {
  return (
    <article className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-slate-100">
        {attachment.previewUrl ? <img src={attachment.previewUrl} alt={attachment.name} className="h-full w-full object-cover" /> : attachment.kind === 'pdf' ? <FileText className="text-red-500" /> : <ImageIcon className="text-slate-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-slate-900">{attachment.name}</h3>
        <p className="text-sm text-slate-500">{attachment.type || attachment.kind} · {(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
        {attachment.extractedText && <p className="mt-2 line-clamp-2 text-xs text-slate-600">{attachment.extractedText}</p>}
      </div>
    </article>
  )
}
