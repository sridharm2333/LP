/**
 * Distress keyword detection (stubbed).
 * Used to trigger Penguin Circle consent flow and grounding messages.
 */

const DISTRESS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live',
  'self harm', 'hurt myself', 'cant go on', 'cant take it anymore',
];

export function containsDistressKeywords(text: string): boolean {
  const lower = (text || '').toLowerCase();
  return DISTRESS_KEYWORDS.some((kw) => lower.includes(kw));
}

export const CRISIS_GROUNDING_MESSAGE = `You're not alone. If you're in crisis, please reach out:
• National Suicide Prevention Lifeline: 988 (US)
• Crisis Text Line: Text HOME to 741741

Take a breath. We're here with you.`;
