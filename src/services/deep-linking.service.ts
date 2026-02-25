import * as Linking from 'expo-linking';

/**
 * Builds deep link URL for opening a specific test.
 * Format: kheia://test/[testId]
 * Uses app scheme from app.json.
 */
export function buildTestDeepLink(testId: string): string {
  return Linking.createURL(`test/${testId}`);
}

/**
 * Builds share message for a test with deep link.
 */
export function buildTestShareMessage(testId: string, subjectName?: string): string {
  const url = buildTestDeepLink(testId);
  const subject = subjectName ? ` la ${subjectName}` : '';
  return `Încearcă acest test${subject} pe KhEIa! Pregătire Evaluare Națională 2026 și BAC. ${url}`;
}
