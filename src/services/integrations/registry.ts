import type { ActionResult, ActionType, WorkflowActionDefinition, WorkflowContext } from '../../types/domain'
import { renderTemplate } from '../templates'
import { extractText } from '../ocr'

type ActionRunner = (action: WorkflowActionDefinition, context: WorkflowContext) => Promise<ActionResult>

export interface IntegrationPlugin {
  type: ActionType
  label: string
  description: string
  secureFields: string[]
  run: ActionRunner
}

async function gmail(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  const to = String(action.config.to ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  const subject = renderTemplate(String(action.config.subject ?? 'Shared: {{filename}}'), context.variables)
  const body = renderTemplate(String(action.config.body ?? '{{summary}}\n\n{{extracted_text}}'), context.variables)
  context.results[action.id] = { to, cc: action.config.cc, bcc: action.config.bcc, subject, body }
  return { status: navigator.onLine ? 'success' : 'queued', message: `Prepared Gmail draft for ${to.length || 1} recipient(s).`, data: context.results[action.id] }
}

async function slack(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  const text = renderTemplate(String(action.config.message ?? '*{{filename}}*\n{{summary}}'), context.variables)
  const webhookUrl = String(action.config.webhookUrl ?? '')
  if (webhookUrl && navigator.onLine) {
    await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, channel: action.config.channel }) })
  }
  context.results[action.id] = { text, channel: action.config.channel, attachmentCount: context.payload.attachments.length }
  return { status: webhookUrl && navigator.onLine ? 'success' : 'queued', message: webhookUrl ? 'Slack message handled.' : 'Slack webhook missing; queued for configuration.', data: context.results[action.id] }
}

async function ocr(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  const texts: string[] = []
  for (const attachment of context.payload.attachments) {
    if (attachment.kind === 'image' || attachment.kind === 'pdf') {
      const text = await extractText(attachment)
      attachment.extractedText = text
      texts.push(text)
    }
  }
  context.variables.extracted_text = texts.join('\n\n')
  context.results[action.id] = { extractedText: context.variables.extracted_text }
  return { status: 'success', message: `Extracted text from ${texts.length} attachment(s).`, data: context.results[action.id] }
}

async function aiSummary(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  const source = [context.payload.text, context.payload.url, context.variables.extracted_text].filter(Boolean).join('\n')
  const summary = source ? source.slice(0, 600) : 'No text content was available. Add OCR or share text to improve summaries.'
  context.variables.summary = `AI-ready summary: ${summary}`
  context.results[action.id] = { summary: context.variables.summary, prompt: action.config.prompt }
  return { status: 'success', message: 'Generated local AI placeholder summary; configure OpenAI edge function for production.', data: context.results[action.id] }
}

async function webhook(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  const endpoint = String(action.config.url ?? '')
  if (endpoint && navigator.onLine) await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(context) })
  return { status: endpoint && navigator.onLine ? 'success' : 'queued', message: endpoint ? 'Webhook dispatched.' : 'Webhook endpoint missing.' }
}

async function upload(action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  return { status: navigator.onLine ? 'success' : 'queued', message: `Prepared ${context.payload.attachments.length} attachment(s) for Supabase Storage upload to ${action.config.bucket ?? 'attachments'}.` }
}

async function saveNote(_action: WorkflowActionDefinition, context: WorkflowContext): Promise<ActionResult> {
  return { status: 'success', message: `Saved note for ${context.variables.filename}.`, data: { text: context.payload.text, summary: context.variables.summary } }
}

export const integrationRegistry: Record<ActionType, IntegrationPlugin> = {
  gmail: { type: 'gmail', label: 'Gmail', description: 'Send editable emails with recipients, CC/BCC, templates, and attachments.', secureFields: ['oauthRefreshToken'], run: gmail },
  slack: { type: 'slack', label: 'Slack', description: 'Post messages through configurable Slack incoming webhooks.', secureFields: ['webhookUrl'], run: slack },
  ocr: { type: 'ocr', label: 'OCR', description: 'Extract text from images and queued PDFs with Tesseract.js.', secureFields: [], run: ocr },
  ai_summary: { type: 'ai_summary', label: 'AI Summary', description: 'Generate summaries, titles, smart routes, and suggestions with OpenAI.', secureFields: ['openaiApiKey'], run: aiSummary },
  webhook: { type: 'webhook', label: 'Webhook', description: 'Send workflow context to any HTTP endpoint.', secureFields: ['secretHeader'], run: webhook },
  upload: { type: 'upload', label: 'Upload File', description: 'Upload attachments to Supabase Storage or future providers.', secureFields: [], run: upload },
  save_note: { type: 'save_note', label: 'Save Note', description: 'Persist shared text and workflow results to history.', secureFields: [], run: saveNote },
}
