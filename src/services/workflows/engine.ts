import type { ActionResult, SharedPayload, WorkflowContext, WorkflowDefinition } from '../../types/domain'
import { integrationRegistry } from '../integrations/registry'
import { enqueueWorkflow } from '../storage'

export interface WorkflowRunResult {
  workflow: WorkflowDefinition
  actionResults: ActionResult[]
  queued: boolean
}

export function buildVariables(payload: SharedPayload): Record<string, string> {
  return {
    filename: payload.attachments.map((item) => item.name).join(', ') || payload.title || 'Shared content',
    summary: '',
    date: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(payload.receivedAt)),
    extracted_text: payload.attachments.map((item) => item.extractedText).filter(Boolean).join('\n\n'),
    text: payload.text ?? '',
    url: payload.url ?? '',
  }
}

export function findMatchingWorkflows(workflows: WorkflowDefinition[], payload: SharedPayload) {
  return workflows.filter((workflow) => {
    if (!workflow.enabled) return false
    if (workflow.trigger === 'manual') return true
    if (workflow.trigger === 'file_shared') return payload.attachments.length > 0
    if (workflow.trigger === 'url_shared') return Boolean(payload.url)
    if (workflow.trigger === 'text_shared') return Boolean(payload.text)
    return false
  })
}

export async function runWorkflow(workflow: WorkflowDefinition, payload: SharedPayload): Promise<WorkflowRunResult> {
  const context: WorkflowContext = { payload, variables: buildVariables(payload), results: {} }
  const actionResults: ActionResult[] = []

  for (const action of [...workflow.actions].filter((item) => item.enabled).sort((a, b) => a.position - b.position)) {
    const plugin = integrationRegistry[action.type]
    if (!plugin) {
      actionResults.push({ status: 'error', message: `No plugin registered for ${action.type}` })
      continue
    }
    try {
      actionResults.push(await plugin.run(action, context))
    } catch (error) {
      actionResults.push({ status: 'error', message: error instanceof Error ? error.message : 'Unknown action failure' })
    }
  }

  const queued = actionResults.some((result) => result.status === 'queued') || !navigator.onLine
  if (queued) await enqueueWorkflow(workflow.id, payload.id)
  return { workflow, actionResults, queued }
}
