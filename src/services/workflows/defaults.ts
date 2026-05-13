import type { WorkflowDefinition } from '../../types/domain'

export const defaultWorkflows: WorkflowDefinition[] = [
  {
    id: 'share-to-email-slack',
    name: 'Share → OCR → Summary → Email + Slack',
    description: 'Extract content, summarize it, and prepare delivery to email and Slack.',
    trigger: 'file_shared',
    enabled: true,
    actions: [
      { id: 'ocr-1', workflow_id: 'share-to-email-slack', type: 'ocr', label: 'OCR Image/PDF', position: 1, enabled: true, config: {} },
      { id: 'summary-1', workflow_id: 'share-to-email-slack', type: 'ai_summary', label: 'AI Summary', position: 2, enabled: true, config: { promptTemplateId: 'ai-summary-default' } },
      { id: 'gmail-1', workflow_id: 'share-to-email-slack', type: 'gmail', label: 'Send Gmail', position: 3, enabled: true, config: { to: '', cc: '', bcc: '', subject: 'Shared: {{filename}}', body: 'Summary:\n{{summary}}\n\nExtracted text:\n{{extracted_text}}' } },
      { id: 'slack-1', workflow_id: 'share-to-email-slack', type: 'slack', label: 'Post to Slack', position: 4, enabled: true, config: { channel: '#inbox', message: '*{{filename}}*\n{{summary}}' } },
    ],
  },
  {
    id: 'quick-note',
    name: 'Share → Save Note',
    description: 'Save shared text, links, and attachment metadata into activity history.',
    trigger: 'text_shared',
    enabled: true,
    actions: [
      { id: 'note-1', workflow_id: 'quick-note', type: 'save_note', label: 'Save Note', position: 1, enabled: true, config: {} },
    ],
  },
]
