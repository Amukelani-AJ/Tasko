import Anthropic from '@anthropic-ai/sdk';
import type { SubTask } from '../types';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateSubtasks(taskTitle: string, taskDescription: string): Promise<SubTask[]> {
  const prompt = `You are a productivity assistant. Break down this task into 3-6 clear, actionable subtasks.

Task: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ''}

Respond ONLY with a JSON array of subtask strings. No preamble, no markdown. Example:
["Research competitors","Draft outline","Write first section"]`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '[]';
  const clean = raw.replace(/```json|```/g, '').trim();
  const titles: string[] = JSON.parse(clean);

  return titles.map((title, i) => ({
    id: `sub-${Date.now()}-${i}`,
    title,
    done: false,
  }));
}
