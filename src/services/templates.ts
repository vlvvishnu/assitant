import type { TemplateDefinition } from '../types/domain'

export const defaultTemplates: TemplateDefinition[] = [
  {
    id: 'email-default',
    name: 'Send shared file',
    type: 'email',
    subject: 'Shared: {{filename}}',
    body: 'Hi,\n\nAttached is {{filename}}.\n\nSummary:\n{{summary}}\n\nExtracted text:\n{{extracted_text}}',
    variables: ['filename', 'summary', 'extracted_text', 'date'],
    updated_at: new Date().toISOString(),
  },
  {
    id: 'slack-default',
    name: 'Post concise update',
    type: 'slack',
    body: '*{{filename}}* shared on {{date}}\n{{summary}}',
    variables: ['filename', 'summary', 'date'],
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ai-summary-default',
    name: 'Action-oriented summary',
    type: 'ai_prompt',
    body: 'Summarize the shared content in 5 bullets, extract action items, and suggest the best workflow route. Content: {{extracted_text}} {{text}}',
    variables: ['extracted_text', 'text'],
    updated_at: new Date().toISOString(),
  },
]

export function renderTemplate(template: string, variables: Record<string, string>) {
  return template.replace(/{{\s*([\w-]+)\s*}}/g, (_, key: string) => variables[key] ?? '')
}
