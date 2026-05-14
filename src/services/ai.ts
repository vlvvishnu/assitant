export interface AiSuggestion {
  title: string
  route: string
  confidence: number
}

export async function suggestWorkflow(text: string): Promise<AiSuggestion> {
  if (!text.trim()) return { title: 'Manual Review', route: 'save_note', confidence: 0.5 }
  if (/invoice|receipt|pdf/i.test(text)) return { title: 'Extract and Email Finance', route: 'ocr,gmail', confidence: 0.82 }
  if (/urgent|incident|alert/i.test(text)) return { title: 'Summarize and Notify Slack', route: 'ai_summary,slack', confidence: 0.78 }
  return { title: 'Summarize and Save', route: 'ai_summary,save_note', confidence: 0.7 }
}
