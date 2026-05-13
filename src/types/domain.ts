export type SharedAttachmentKind = 'image' | 'pdf' | 'file'

export interface SharedAttachment {
  id: string
  name: string
  type: string
  size: number
  kind: SharedAttachmentKind
  blob: Blob
  previewUrl?: string
  extractedText?: string
}

export interface SharedPayload {
  id: string
  title?: string
  text?: string
  url?: string
  receivedAt: string
  source: 'web-share-target' | 'manual' | 'restore'
  attachments: SharedAttachment[]
  metadata: Record<string, string | number | boolean>
}

export type TriggerType = 'file_shared' | 'text_shared' | 'url_shared' | 'manual'
export type ActionType = 'gmail' | 'slack' | 'ocr' | 'ai_summary' | 'webhook' | 'upload' | 'save_note'

export interface WorkflowActionConfig {
  [key: string]: unknown
}

export interface WorkflowActionDefinition {
  id: string
  workflow_id: string
  type: ActionType
  label: string
  position: number
  enabled: boolean
  config: WorkflowActionConfig
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  trigger: TriggerType
  enabled: boolean
  actions: WorkflowActionDefinition[]
  created_at?: string
  updated_at?: string
}

export interface TemplateDefinition {
  id: string
  name: string
  type: 'email' | 'workflow' | 'ai_prompt' | 'slack'
  body: string
  subject?: string
  variables: string[]
  updated_at: string
}

export interface IntegrationDefinition {
  id: string
  type: ActionType
  name: string
  connected: boolean
  encryptedSecrets?: Record<string, string>
  config: Record<string, unknown>
}

export interface WorkflowContext {
  payload: SharedPayload
  variables: Record<string, string>
  results: Record<string, unknown>
}

export interface ActionResult {
  status: 'success' | 'queued' | 'error'
  message: string
  data?: unknown
}
